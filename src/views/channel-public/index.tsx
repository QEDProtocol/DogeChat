import {useEffect, useMemo, useState} from 'react';
import {RouteComponentProps, useNavigate} from '@reach/router';
import {Helmet} from 'react-helmet';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import ChannelInfo from 'views/channel/components/channel-info';
import useTranslation from 'hooks/use-translation';
import Raven from 'raven/raven';
import {Channel} from 'types';

const ChannelPublicPage = (props: RouteComponentProps) => {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const [channel, setChannel] = useState<Channel | null>(null);
    const [notFound, setNotFound] = useState(false);
    const raven = useMemo(() => new Raven('', ''), []);

    useEffect(() => {
        if (!('channel' in props)) navigate('/').then();
    }, [props]);

    useEffect(() => {
        if (('channel' in props)) {
            const timer = setTimeout(() => setNotFound(true), 5000);

            raven.fetchChannel(props.channel as string).then(channel => {
                if (channel) {
                    setChannel(channel);
                    clearTimeout(timer);
                }
            });

            return () => clearTimeout(timer);
        }
    }, [raven, props]);

    if (channel) {
        return <>
            <Helmet><title>{t(`NostrChat - ${channel.name}`)}</title></Helmet>
            <Box sx={{maxWidth: '500px', ml: '10px', mr: '10px'}}>
                <ChannelInfo channel={channel} onJoin={() => {
                }}/>
            </Box>
        </>
    }

    return <>
        <Helmet><title>{t('NostrChat')}</title></Helmet>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            {(() => {
                if (notFound) return t('Channel not found');
                return <><CircularProgress size={20} sx={{mr: '8px'}}/> {t('Loading...')}</>
            })()}
        </Box>
    </>
}

export default ChannelPublicPage;
