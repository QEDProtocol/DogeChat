import React, {useEffect} from 'react';
import {useAtom} from 'jotai';
import {channelsAtom, dogeChatConfigAtom, spammersAtom} from 'atoms';
import { getDogeChatConfig, mergeChannels } from 'util/dogeChatConfig';

const RemoteDataProvider = (props: { children: React.ReactNode }) => {
    const [, setSpammers] = useAtom(spammersAtom);
    const [, setDogeChatConfig] = useAtom(dogeChatConfigAtom);
    const [existingChannels, setChannels] = useAtom(channelsAtom);

    useEffect(() => {
        getDogeChatConfig().then((cfg)=>{
            setDogeChatConfig(cfg);
            setChannels(mergeChannels(cfg.getChannels(), existingChannels));
        }).catch(err=>{
            console.error('ERROR LOADING CONFIG', err);
        });
    }, []);

    return <>
        {props.children}
    </>;
}

export default RemoteDataProvider;
