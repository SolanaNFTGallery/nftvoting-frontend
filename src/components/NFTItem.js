import React from 'react';
import styled from 'styled-components'
import {getMetadata} from "../service/metadata";
import { Button, Center } from "@chakra-ui/react"

const NFTItem = ({data}) => {
    const [metaData, setMetaData] = React.useState({});
    React.useEffect(() => {
        getData(data);
    }, [data]);

    const getData = React.useCallback(async (data) => {
        console.log('data uri---', data)
        if (data.uri) {
            const result = await getMetadata(data.uri)
            setMetaData(result.data);
        }
    }, [])
    return (
        <Container pos="relative">
            <NFTImg src={metaData?.image} alt={`No Assets for ${metaData?.name}`}/>
            <Title>
                {metaData?.name}
            </Title>
            <Description>
                {metaData?.description}
            </Description>
            {/*<Center w={"full"}>*/}
            <Button colorScheme="blue" variant="outline" w={"80%"} pos="absolute" bottom={10} left={"10%"}>
                Vote
            </Button>
            {/*</Center>*/}
            {/*<Date>11/07/2021</Date>*/}
        </Container>
    )
};

const Container = styled.div`
  width: 100%;
  background-color: #161519;
  padding-bottom: 20px;
  border-radius: 30px;
  min-height: 500px;
  &:hover {
    background-color: #7111b6;
    cursor: pointer;
  }
`
const Title = styled.h1`
  color: white;
  margin-top: 20px;
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
