import { ChakraProvider, Box, Text, Code } from '@chakra-ui/react';
import React, { useState } from 'react';
function FalseOutPut({data}){
    console.log(data)
    const output=data.split('\n')
    const [result,setResult]=useState(output)
    return (
        <ChakraProvider>
      <Box padding="20px" borderRadius="md">
        {result.map((line, index) => (
          <Text key={index} marginBottom="0" color="red.500">
            <Code color="red.500" bg="none">{line}</Code>
          </Text>
        ))}
      </Box>
    </ChakraProvider>
    )
}

export default FalseOutPut