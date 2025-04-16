import { useMutation, useQuery } from "@apollo/client";
import { Button, Col, Form, Row, Spin } from "antd";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/common/firebase/index";
import { toastDefault } from "@/common/toast.tsx";
import { addSingleBook } from "@/graphql-client/mutations.tsx";
import { getAuthors, getBooks, getGenres } from "@/graphql-client/query.tsx";
import Uploadimage from "../uploadimage";
import "./form.css";
import { InputFormItem } from "@/components/atoms/input-form-item";
import { TextAreaFormItem } from "@/components/atoms/text-area-form-item";
import { InputCurrencyFormItem } from "@/components/atoms/input-currency-form-item";
import { SelectFormItem } from "@/components/atoms/select-form-item";

const Addbook: React.FC = () => {
  const navigate = useNavigate();
  const [add, Mutation] = useMutation<any>(addSingleBook);
  const [imageFile, setImageFile] = useState<any>([]);
  const uploadImageState = useCallback((image: File) => {
    setImageFile(image);
  }, []);
  const { loading, error, data } = useQuery(getAuthors);
  const { loading: loading1, error: error1, data: data1 } = useQuery(getGenres);
  if (loading || loading1) {
    return <Spin size="large" />;
  }
  if (error || error1) {
    return <p>error authors ...</p>;
  }
  const onFinish = async (values: any) => {
    values.price = Number(values.price);
    values.quantity = Number(values.quantity);
    const storage = getStorage();
    const uploadImagePromise = (image: any) => {
      return new Promise(function (resolve) {
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadBytes(storageRef, image).then(async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        });
      });
    };
    const listImageUrl: string[] = [];
    for (const element of imageFile) {
      await uploadImagePromise(element.originFileObj).then((response: any) => {
        listImageUrl.push(response);
      });
    }
    values.image = JSON.stringify(listImageUrl);

    add({
      variables: values,
      refetchQueries: [{ query: getBooks }],
    });
  };
  if (Mutation.loading) {
    return <Spin size="large" />;
  }
  if (Mutation.data) {
    toastDefault("Thêm sách thành công");
    navigate("/admin/books");
  }
  return (
    <div>
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
                label: "Tên sách",
                rules: [{ required: true, message: "Bạn phải nhập Tên sách" }],
              }}
            />
          </Col>
          <Col span={24}>
            <TextAreaFormItem
              formItemProps={{
                name: "des",
                label: "Mô tả",
                rules: [{ required: true, message: "Bạn phải nhập mô tả" }],
              }}
            />
          </Col>
          <Col span={12}>
            <InputCurrencyFormItem
              formItemProps={{
                name: "price",
                label: "Giá tiền",
                rules: [{ required: true, message: "Bạn phải nhập giá tiền" }],
              }}
            />
          </Col>
          <Col span={12}>
            <InputCurrencyFormItem
              formItemProps={{
                name: "quantity",
                label: "Số lượng",
                rules: [{ required: true, message: "Bạn phải nhập số lượng" }],
              }}
            />
          </Col>
          <Col span={24}>
            <Form.Item name="image" label="Thêm ảnh">
              <Uploadimage imageData={""} uploadImageState={uploadImageState} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <SelectFormItem
              formItemProps={{
                name: "genreId",
                label: "Thể loại chuyện",
                rules: [
                  { required: true, message: "Bạn phải chọn thể loại truyện" },
                ],
              }}
              selectProps={{
                options: data1?.genres.map((genre: any) => ({
                  value: genre.id,
                  label: genre.name,
                })),
                placeholder: "Chọn thể loại chuyện",
              }}
            />
          </Col>
          <Col span={12}>
            <SelectFormItem
              formItemProps={{
                name: "authorId",
                label: "Tác giả",
                rules: [{ required: true, message: "Bạn phải chọn tác giả" }],
              }}
              selectProps={{
                options: data?.authors.map((author: any) => ({
                  value: author.id,
                  label: author.name,
                })),
                placeholder: "Chọn tác giả",
              }}
            />
          </Col>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );
};

export default Addbook;
