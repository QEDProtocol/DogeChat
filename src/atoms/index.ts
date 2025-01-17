import {atom} from 'jotai';
import {
    Channel,
    ChannelUpdate,
    EventDeletion,
    Profile,
    PublicMessage,
    DirectMessage,
    ChannelMessageHide,
    ChannelUserMute,
    MuteList,
    Message,
    Reaction,
    DirectContact,
    ReadMarkMap,
    Keys,
    RavenState
} from 'types';
import {GLOBAL_CHAT} from 'const';
import Raven from 'raven/raven';
import type { DogeChatConfig } from 'util/dogeChatConfig';

export * from 'atoms/ui';

export const keysAtom = atom<Keys | undefined>(undefined);
export const tempPrivAtom = atom<string>('');
export const ravenAtom = atom<Raven | undefined>(undefined);
export const ravenStatusAtom = atom<RavenState>({ready: false, dmsDone: false, syncDone: false});
export const profilesAtom = atom<Profile[]>([]);
export const profileAtom = atom<Profile | null>(null);
export const channelsAtom = atom<Channel[]>([GLOBAL_CHAT]);
export const channelAtom = atom<Channel | null>(null);
export const channelToJoinAtom = atom<Channel | null>(null);
export const channelUpdatesAtom = atom<ChannelUpdate[]>([]);
export const eventDeletionsAtom = atom<EventDeletion[]>([]);
export const publicMessagesAtom = atom<PublicMessage[]>([]);
export const directMessagesAtom = atom<DirectMessage[]>([]);
export const directContactsAtom = atom<DirectContact[] | []>([]);
export const directMessageAtom = atom<string | null>(null);
export const profileToDmAtom = atom<Profile | null>(null);
export const channelMessageHidesAtom = atom<ChannelMessageHide[]>([]);
export const channelUserMutesAtom = atom<ChannelUserMute[]>([]);
export const muteListAtom = atom<MuteList>({pubkeys: [], encrypted: ''});
export const leftChannelListAtom = atom<string[]>([]);
export const threadRootAtom = atom<Message | null>(null);
export const reactionsAtom = atom<Reaction[]>([]);
export const backupWarnAtom = atom<boolean>(false);
export const activeMessageAtom = atom<string | null>(null);
export const readMarkMapAtom = atom<ReadMarkMap>({});
export const showRequestsAtom = atom<boolean>(false);
export const spammersAtom = atom<Record<string, number>>({});
export const dogeChatConfigAtom = atom<DogeChatConfig | null>(null);