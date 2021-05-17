import { Box, Button, FormControl, FormLabel, Select } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import {
  Employee,
  useCreatePostMutation,
  useEmployeesQuery,
} from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [createPost] = useCreatePostMutation();
  const { data, error, loading, refetch } = useEmployeesQuery({});
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "", responsibleId: 0 }}
        onSubmit={async (values) => {
          values.responsibleId = +values.responsibleId;

          const { errors } = await createPost({
            variables: { input: values },
            update: (cache) => {
              cache.evict({ fieldName: "posts:{}" });
            },
          });
          if (!errors) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>

            {!data && loading ? (
              <div>loading...</div>
            ) : (
              <FormControl mt={4}>
                <FormLabel>Responsible</FormLabel>
                <Select
                  name="responsibleId"
                  onChange={(e) =>
                    setFieldValue("responsibleId", e.target.value)
                  }
                  id="responsibleId"
                  placeholder="Select employee"
                >
                  {data!.employees.map((e: Employee) =>
                    !e ? null : (
                      <option key={e.id} value={e.id}>
                        {e.username}
                      </option>
                    )
                  )}
                </Select>
              </FormControl>
            )}

            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantColor="teal"
            >
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
