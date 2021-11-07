import React from 'react';
import styled from 'styled-components'
import {getMetadata} from "../service/metadata";

const NFTItem = (data) => {
    const [metaData, setMetaData] = React.useState({});
    React.useEffect(() => {
        // console.log('data---', data.data.data.uri);
        getData();
    }, [data]);

    const getData = React.useCallback(async () => {
        const result = await getMetadata(data.data.data.uri)
        setMetaData(result.data);
        // console.log('metadata--',  result.data)
    }, [data.data.data.uri])
    return (
        <Container>
            <NFTImg src={metaData?.image}/>
            <Title>
                {metaData?.name}
            </Title>
            <Description>
                {metaData?.description}
            </Description>
            <Date>11/07/2021</Date>
        </Container>
    )
};

const Container = styled.div`
  width: 100%;
  background-color: #161519;
  padding-bottom: 20px;
  border-radius: 30px;
`
const Title = styled.h2`
  color: white;
`
const Description = styled.p`
  color: #aca1b0;
  width: 70%;
  margin: auto;
`;
const Date = styled.h4`
  color: #aca1b0;
`;
const NFTImg = styled.img`
  width: 100%;
  height: 300px;
  border-radius: 30px;
`;

export default NFTItem