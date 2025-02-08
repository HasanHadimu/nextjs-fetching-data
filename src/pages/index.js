import Head from 'next/head';
import { Container, Heading, Table, Thead, Tbody, Tr, Th, Td, Image, Box, Spinner, FormControl, FormLabel, VStack, Input, Button } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      description: "",
      images: "",
    },
    onSubmit: () => {
      mutate();
    }
  });

  const { mutate } = useMutation({
    mutationFn: async () => {
      const { name, price, description, image } = formik.values;
      const productResponse = await axios.post("http://localhost:2000/products", {
        name,
        description,
        price: parseInt(price),
        image,
      });
      return productResponse;
    },
  });

  const handleFormInput = (event) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const productResponse = await axios.get("http://localhost:2000/products");
      setProducts(productResponse.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProducts = () => {
    return products.map((product) => (
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
    ));
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
          <Box overflowX="auto" boxShadow="xl" borderRadius="lg" p={6} bg="white" w="100%">
            <Table variant="striped" colorScheme="gray" size="md" minW="600px" mb="6">
              <Thead bg="gray.100">
                <Tr>
                  <Th>ID</Th>
                  <Th>Product Name</Th>
                  <Th>Description</Th>
                  <Th>Price</Th>
                  <Th>Image</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td colSpan="5" textAlign="center">
                      <Spinner />
                    </Td>
                  </Tr>
                ) : renderProducts()}
              </Tbody>
            </Table>
            <Heading mt={8} fontSize="xl" textAlign="center">Form Tambah Produk</Heading>
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing="4" mt={4}>
                <FormControl>
                  <FormLabel>Product Name</FormLabel>
                  <Input onChange={handleFormInput} name="name" value={formik.values.name} />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input onChange={handleFormInput} name="description" value={formik.values.description} />
                </FormControl>
                <FormControl>
                  <FormLabel>Price</FormLabel>
                  <Input type="number" onChange={handleFormInput} name="price" value={formik.values.price} />
                </FormControl>
                <FormControl>
                  <FormLabel>Image URL</FormLabel>
                  <Input onChange={handleFormInput} name="image" value={formik.values.image} />
                </FormControl>
                <Button type="submit" colorScheme="blue" w="full">Submit Product</Button>
              </VStack>
            </form>
          </Box>
        </Container>
      </main>
    </>
  );
}
