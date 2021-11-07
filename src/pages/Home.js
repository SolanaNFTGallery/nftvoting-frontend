import React from 'react';
import {getNFTTokens} from '../service/web3';
import NFTItem from "../components/NFTItem";
import styled from 'styled-components';
import { Container, Row, Col } from 'react-grid-system';
const web3 = require('@solana/web3.js');

const Home = () => {
    const [phantom, setPhantom] = React.useState(null);
    const [connected, setConnected] = React.useState(false);
    const [publicKey, setPublickKey] = React.useState(null);
    const [connection, setConnection] = React.useState(null);
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        console.log('window', window)
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

    const getConnection = () => {
        setConnection(new web3.Connection(
            'https://api.devnet.solana.com',
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
    return <ContainerView>
        {(phantom && !connected) && <button onClick={connectPhantom}>Connect Phantom</button>}
        {(phantom && connected) && <button onClick={disconnectHandler}>Disconnect Phantom</button>}
        {!phantom && <a
            href="https://phantom.app/"
            target="_blank"
            className="bg-purple-500 px-4 py-2 border border-transparent rounded-md text-base font-medium text-white"
        >
            Get Phantom
        </a>}
        {/*{(phantom && connected) && <button onClick={getBalance}>Get Balance</button>}*/}
        {(phantom && connected) && <button onClick={getTokens}>Get Tokens</button>}
        <Container>
            <Row>
                {data.map(item => {
                    return <Col sm={4}>
                        <NFTItem data={item}/>
                    </Col>
                })}
            </Row>
        </Container>

    </ContainerView>
}
const ContainerView = styled.div`
    padding-top: 100px;
  padding-left: 20%;
  padding-right: 20%;
`;

export default Home;