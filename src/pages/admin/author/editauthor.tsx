import { useMutation, useQuery } from "@apollo/client";
import { Button, Form, Input, Spin } from "antd";
import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toastDefault } from "@/common/toast.tsx";
import { updateSingleAuthor } from "@/graphql-client/mutations.tsx";
import { getAuthors, getSingleAuthor } from "@/graphql-client/query.tsx";
import "./form.css";

const Editauthor: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { loading, data } = useQuery(getSingleAuthor, {
    variables: {
      slug: slug,
    },
  });
  const [add, Mutation] = useMutation<any>(updateSingleAuthor);
  const hasShownToast = useRef(false);

  // Xử lý sửa tác giả thành công
  useEffect(() => {
    if (Mutation.data && !hasShownToast.current) {
      toastDefault("Sửa tác giả thành công");
      hasShownToast.current = true;
      navigate("/admin/authors");
    }
  }, [Mutation.data, navigate]);

  // Reset toast flag khi component mount
  useEffect(() => {
    hasShownToast.current = false;
  }, []);

  const onFinish = (values: any) => {
    values.phone = Number(values.phone);
    values.id = data.author.id;
    add({
      variables: values,
      refetchQueries: [{ query: getAuthors }],
    });
  };

  if (Mutation.loading) {
    return <Spin size="large" />;
  }

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <h2>Sửa tác giả</h2>
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Tên tác giả"
          rules={[{ required: true, message: "Bạn phải nhập tên tác giả" }]}
        >
          <Input defaultValue={data?.author.name} />
        </Form.Item>
        <Form.Item
          name="age"
          label="Age"
          rules={[{ required: true, message: "Bạn phải nhập tên tuổi" }]}
        >
          <Input defaultValue={data?.author.age} />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: "Bạn phải nhập địa chỉ" }]}
        >
          <Input defaultValue={data?.author.address} />
        </Form.Item>
        <Form.Item>
          <Button loading={Mutation.loading} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Editauthor;
