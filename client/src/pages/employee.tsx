import React from "react";
import { withApollo } from "../utils/withApollo";
import {
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  Employee as EmployeeType,
} from "../generated/graphql";
import {
  Box,
  Flex,
  Button,
  Heading,
  Stack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  IconButton,
} from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useEmployeesQuery } from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";

const Employee: React.FC<{}> = () => {
  useIsAuth();
  const { data, error, loading, refetch } = useEmployeesQuery({});
  const [createEmployee] = useCreateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!loading && !data) {
    return (
      <div>
        <div>you got query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Layout variant="small">
      <Button onClick={onOpen} mb={4}>
        Create Employee
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ username: "", email: "" }}
              onSubmit={async (values, { resetForm }) => {
                const { errors } = await createEmployee({
                  variables: { input: values },
                });

                if (!errors) {
                  await refetch();
                  resetForm();
                  onClose();
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <InputField
                    name="username"
                    placeholder="username"
                    label="Username"
                  />
                  <Box mt={4}>
                    <InputField
                      name="email"
                      placeholder="email"
                      label="Email"
                      type="email"
                    />
                  </Box>

                  <Button
                    mt={4}
                    mb={4}
                    type="submit"
                    isLoading={isSubmitting}
                    variantColor="teal"
                  >
                    Create Employee
                  </Button>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>

      {!data && loading ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.employees.map((e: EmployeeType) =>
            !e ? null : (
              <Flex key={e.id} p={5} shadow="md" borderWidth="1px">
                <Box flex={1}>
                  <Heading fontSize="xl">{e.username}</Heading>

                  {e.email}
                </Box>
                <Box>
                  <IconButton
                    icon="delete"
                    aria-label="Delete Post"
                    onClick={() => {
                      deleteEmployee({
                        variables: { id: e.id },
                        update: (cache) => {
                          cache.evict({ id: "Employee:" + e.id });
                        },
                      });
                    }}
                  />
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: false })(Employee);
