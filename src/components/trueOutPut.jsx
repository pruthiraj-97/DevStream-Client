import { ChakraProvider, Box, Text, Code } from '@chakra-ui/react';
import React, { useState } from 'react';
function TrueOutPut({ data }){
    const [result,setResult]=useState(data.split('\n'))
    console.log("result in out put is",result)
    return (
        <ChakraProvider>
        <Box padding="20px" color="yellow.400" borderRadius="md">
          {result.map((line, index) => (
            <Text key={index} marginBottom="0" whiteSpace="pre-wrap">
              <Code colorScheme="gold">{line}</Code>
            </Text>
          ))}
        </Box>
      </ChakraProvider>
    )
}

export default TrueOutPut