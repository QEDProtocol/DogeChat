import { Channel } from 'types';

interface IOfficialChannelV1 {
    id: string;
    name: string;
    description: string;
    creator: string;
    created: number;
    icon?: string;
    picture?: string;
}
interface IUserDefInnerV1 {
    inlineIcon?: string;
    role?: string;
    verifiedGroups?: string[];
    verifiedDescription?: string;
    profileNameClass?: string;
    github?: string;
    twitter?: string;
    spammer?: boolean;
    blocked?: boolean;
}
interface IUserDefV1 extends IUserDefInnerV1{
    id: string;
}
interface IDogeChatConfigV1 {
    version: string;
    motd: string;
    blockedWords: string[];
    userDefs: IUserDefV1[];
    allowedLinkHostnames: string[];
    allowedImageHostnames: string[];
    allowedVideoHostnames: string[];
    defaultChannels: IOfficialChannelV1[];
}
interface IDogeChatConfigStateV1 {
    version: string;
    motd: string;
    blockedWords: string[];
    users: Record<string, IUserDefV1>;
    allowedLinkHostnames: string[];
    allowedImageHostnames: string[];
    allowedVideoHostnames: string[];
    defaultChannels: IOfficialChannelV1[];
}
function matchesWhitelistUrl(url: URL, whiteListItem: string){
    if(whiteListItem.substring(0,2) === '*.'){
        const urlHostnameParts = url.hostname.split('.');
        if(urlHostnameParts.length < 3) return false;
        const whiteListItemParts = whiteListItem.substring(2).split('.');
        return whiteListItemParts.join('.') === urlHostnameParts.slice(-whiteListItemParts.length).join('.');
    }else{
        return url.hostname === whiteListItem;
    }
}
function checkUrlAgainstWhitelist(url: string, whitelist: string[]){
    if(!url || typeof url !== 'string' || url.indexOf('://') === -1) return false;
    try {
        const urlParsed = new URL(url.toLowerCase());
        if(whitelist.some(x=>matchesWhitelistUrl(urlParsed, x.toLowerCase()))) return true;
        return false;
    } catch (e) {
        return false;
    }
}
class DogeChatConfig implements IDogeChatConfigStateV1 {
    version: string;
    motd: string;
    blockedWords: string[];
    users: Record<string, IUserDefV1>;
    allowedLinkHostnames: string[];
    allowedImageHostnames: string[];
    defaultChannels: IOfficialChannelV1[];
    allowedVideoHostnames: string[];
    constructor(config: IDogeChatConfigStateV1) {
        this.version = config.version;
        this.motd = config.motd;
        this.blockedWords = config.blockedWords;
        this.users = config.users;
        this.allowedLinkHostnames = config.allowedLinkHostnames;
        this.allowedImageHostnames = config.allowedImageHostnames;
        this.allowedVideoHostnames = config.allowedVideoHostnames;
        this.defaultChannels = config.defaultChannels;
    }
    getUserById(id: string): IUserDefV1 {
        return this.users[id] || {id: id};
    }
    userIsBlocked(id: string): boolean {
        return this.users[id]?.blocked ?? false;
    }
    getChannels(): Channel[] {
        return this.defaultChannels.map(officialChannelToChannel);
    }
    isValidLink(url?: string){
        return (!!url) && checkUrlAgainstWhitelist(url, this.allowedLinkHostnames);
    }
    isValidImage(url?: string){
        return (!!url) && checkUrlAgainstWhitelist(url, this.allowedImageHostnames);
    }
    isValidVideo(url?: string){
        return (!!url) && checkUrlAgainstWhitelist(url, this.allowedVideoHostnames);
    }
}
function mergeChannels(incomingChannels: Channel[], existingChannels: Channel[]): Channel[] {
    const existingIds = existingChannels.map(x=>x.id);
    return existingChannels.concat(incomingChannels.filter(x=>!existingIds.includes(x.id)));
}
function chatConfigToState(config: IDogeChatConfigV1): DogeChatConfig {
    const users: Record<string, IUserDefV1> = {};
    for (const user of config.userDefs) {
        users[user.id] = user;
    }
    return new DogeChatConfig({
        version: config.version,
        motd: config.motd,
        blockedWords: config.blockedWords,
        users,
        allowedLinkHostnames: config.allowedLinkHostnames,
        allowedImageHostnames: config.allowedImageHostnames,
        defaultChannels: config.defaultChannels,
        allowedVideoHostnames: config.allowedVideoHostnames
    });
}


async function getDogeChatConfig(): Promise<DogeChatConfig> {
    const resp = await fetch('/config/chat-config.json?t=' + Date.now());
    const config: IDogeChatConfigV1 = await resp.json();
    const cls =  chatConfigToState(config);
    return cls;
}
function officialChannelToChannel(ch: IOfficialChannelV1): Channel {
    return {
        id: ch.id,
        creator: ch.creator,
        created: ch.created,
        name: ch.name,
        about: ch.description,
        picture: ch.picture||'',
    };
}
export type {
    IDogeChatConfigStateV1,
    IUserDefV1,
    IOfficialChannelV1
};
export {
    getDogeChatConfig,
    DogeChatConfig,
    mergeChannels,
}