import { useMutation } from "@apollo/client";
import { Button, Col, Form, Row, Spin } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toastDefault } from "@/common/toast";
import { addSingleGenre } from "@/graphql-client/mutations.tsx";
import { getBooks, getGenres } from "@/graphql-client/query.tsx";
import "./form.css";
import { InputFormItem } from "@/components/atoms/input-form-item";

const Addauthor: React.FC = () => {
  const navigate = useNavigate();
  const [add, Mutation] = useMutation<any>(addSingleGenre);
  const onFinish = (values: any) => {
    add({
      variables: values,
      refetchQueries: [{ query: getGenres }, { query: getBooks }],
    });
  };
  console.log(add);

  if (Mutation.loading) {
    return <Spin size="large" />;
  }
  if (Mutation.data) {
    toastDefault("Thêm thể loại thành công");
    navigate("/admin/genre");
  }
  return (
    <div>
      <h2>Thêm thể loại</h2>
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <InputFormItem
              formItemProps={{
                name: "name",
                label: "Tên thể loại",
                rules: [
                  { required: true, message: "Bạn phải nhập tên thể loại" },
                ],
              }}
            />
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Addauthor;
