import React from 'react';
import {getNFTTokens} from '../service/web3';
import NFTItem from "../components/NFTItem";
import styled from 'styled-components';
import { Button, Stack } from "@chakra-ui/react"
import { Container, Row, Col } from 'react-grid-system';
const web3 = require('@solana/web3.js');
const {PublicKey} = require('@solana/web3.js');

const Home = () => {
    const [phantom, setPhantom] = React.useState(null);
    const [connected, setConnected] = React.useState(false);
    const [publicKey, setPublickKey] = React.useState(null);
    const [connection, setConnection] = React.useState(null);
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        setTimeout(() => {
            if (window.hasOwnProperty('solana')) {
                setPhantom(window["solana"]);
            }
        }, 100)
    }, []);
    React.useEffect(() => {
        phantom?.on("connect", (res) => {
            setConnected(true);
            setPublickKey(res);
            getConnection()
        });

        phantom?.on("disconnect", () => {
            console.log('disconnect');
            setConnected(false);
            setPublickKey(null)
            setConnection(null)
        });
    }, [phantom]);

    const getInitNFTs = async () => {
        const results = await getNFTTokens(new PublicKey(process.env.REACT_APP_WALLET_ADDRESS), connection)
        setData(results);
    };

    const getConnection = () => {
        setConnection(new web3.Connection(
            process.env.REACT_APP_RPC_URL,
            'confirmed',
        ));
    };

    const connectPhantom = React.useCallback(() => {
      phantom.connect();
    }, [phantom]);

    const disconnectHandler = React.useCallback(() => {
        phantom?.disconnect();
    }, [phantom]);

    const getBalance = React.useCallback(async () => {
        if (!connection) return;
        let stakeBalance = await connection.getBalance(publicKey);
        console.log('balance--', stakeBalance)
    }, [connection, publicKey])

    const getTokens = React.useCallback(async () => {
        console.log(!connection || !publicKey);
        if (!connection || !publicKey) return;
        const result = await getNFTTokens(publicKey, connection);
        console.log(result);
        setData(result)
    }, [connection, publicKey])

    const RenderData = React.useCallback(() => {
        return  <Container>
            <Row>
                {data.map(item => {
                    if (item && item.uri) {
                        return <Col sm={4} key={item?.uri} style={{marginTop: 30}}>
                            <NFTItem data={item}/>
                        </Col>
                    }
                    if (item && item.data.uri) {
                        return <Col sm={4} key={item?.data?.uri} style={{marginTop: 30}}>
                            <NFTItem data={item.data}/>
                        </Col>
                    }
                    return <div key={item?.token}/>
                })}
            </Row>
        </Container>
    }, [data])
    return <ContainerView>
        <Stack direction="row" spacing={4} align="flex-end">
            {(phantom && !connected) && <Button colorScheme="teal" variant="solid" onClick={connectPhantom}>
                Connect Phantom
            </Button>}
            {(phantom && connected) && <Button colorScheme="teal" variant="solid" onClick={disconnectHandler}>
                DisConnect Phantom
            </Button>}
            {!phantom && <a
                href="https://phantom.app/"
                target="_blank"
                className="bg-purple-500 px-4 py-2 border border-transparent rounded-md text-base font-medium text-white"
            >
                <Button colorScheme="teal" variant="solid">
                    Get Phantom
                </Button>
            </a>}
            {(phantom && connected) && <Button colorScheme="teal" variant="outline" onClick={getInitNFTs}>
                Get Init NFTs
            </Button>}
            {(phantom && connected) && <Button colorScheme="teal" variant="outline" onClick={getTokens}>
                Get NFTs
            </Button>}
        </Stack>
        {RenderData()}

    </ContainerView>
}
const ContainerView = styled.div`
    padding-top: 100px;
  padding-left: 20%;
  padding-right: 20%;
  flex:1;
`;

export default Home;