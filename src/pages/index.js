import Head from 'next/head';
import { Container, Heading, Table, Thead, Tbody, Tr, Th, Td, Image, Box } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  
  const fetchProducts = async () => {
    try {
      const productResponse = await axios.get("http://localhost:2000/products");
      setProducts(productResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Head>
        <title>Product List</title>
        <meta name="description" content="Product list fetched from API" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container maxW="container.lg" py={8}>
          <Heading mb={6} textAlign="center" fontSize={{ base: "2xl", md: "3xl" }}>
            Data Produk
          </Heading>
          <Box overflowX="auto" boxShadow="xl" borderRadius="lg" p={4} bg="white" w="100%">
            <Table variant="simple" size="md" minW="600px">
              <Thead bg="gray.100">
                <Tr>
                  <Th>ID</Th>
                  <Th>Nama Produk</Th>
                  <Th>Deskripsi</Th>
                  <Th>Harga</Th>
                  <Th>Gambar</Th>
                </Tr>
              </Thead>
              <Tbody>
                {products.map((product) => (
                  <Tr key={product.id} _hover={{ bg: "gray.50" }}>
                    <Td>{product.id.toString()}</Td>
                    <Td fontWeight="bold">{product.name}</Td>
                    <Td maxW="250px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{product.description}</Td>
                    <Td fontWeight="semibold" color="green.500">Rp {product.price.toLocaleString()}</Td>
                    <Td>
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        boxSize={{ base: "70px", md: "50px" }} 
                        objectFit="cover" 
                        borderRadius="md" 
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Container>
      </main>
    </>
  );
}