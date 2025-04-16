import { useMutation, useQuery } from "@apollo/client";
import { Button, Col, Form, Row, Spin } from "antd";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "@/common/firebase/index";
import { toastDefault } from "@/common/toast.tsx";
import { updateSingleBook } from "@/graphql-client/mutations.tsx";
import {
  getAuthors,
  getBooks,
  getGenres,
  getSingleBook,
} from "@/graphql-client/query.tsx";
import Uploadimage from "../uploadimage";
import "./form.css";
import { InputFormItem } from "@/components/atoms/input-form-item";
import { TextAreaFormItem } from "@/components/atoms/text-area-form-item";
import { InputCurrencyFormItem } from "@/components/atoms/input-currency-form-item";
import { SelectFormItem } from "@/components/atoms/select-form-item";

const Editbook: React.FC = () => {
  const { slug } = useParams();
  const [form] = Form.useForm();
  const {
    loading: loading1,
    error: error1,
    data: data1,
  } = useQuery(getSingleBook, {
    variables: {
      slug: slug,
    },
  });

  useEffect(() => {
    if (!data1) return;
    form.setFieldsValue({
      ...data1.book,
      genreId: data1?.book?.genre?.id,
      authorId: data1?.book?.author?.id,
    });
    if (!data1.book?.image) return;
    const imageJson = JSON.parse(data1.book?.image) ?? [];
    setImageDefault(imageJson);
  }, [form, data1]);

  const navigate = useNavigate();
  const [update, Mutation] = useMutation<any>(updateSingleBook);
  const [imageFile, setImageFile] = useState<any>([]);
  const [imageDefault, setImageDefault] = useState<any>([]);

  const uploadImageState = useCallback((image: File) => {
    setImageFile(image);
  }, []);
  const { loading, error, data } = useQuery(getAuthors);
  const { loading: loading2, error: error2, data: data2 } = useQuery(getGenres);
  if (loading || loading1 || loading2) {
    return <Spin size="large" />;
  }
  if (error || error1 || error2) {
    return <p>error authors ...</p>;
  }

  const onFinish = async (values: any) => {
    values.price = Number(values.price);
    values.id = data1.book.id;

    if (values.name === undefined) values.name = data1.book.name;
    if (values.des === undefined) values.des = data1.book.des;
    if (isNaN(values.price)) values.price = data1.book.price;
    if (values.quantity === undefined) values.quantity = data1.book.quantity;
    if (values.genreId === undefined) values.genreId = data1.book.genre.id;
    if (values.authorId === undefined) values.authorId = data1.book.author.id;
    if (imageFile?.length > 0) {
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
        await uploadImagePromise(element.originFileObj).then(
          (response: any) => {
            listImageUrl.push(response);
          },
        );
      }
      values.image = JSON.stringify(listImageUrl);
    }
    update({
      variables: values,
      refetchQueries: [{ query: getBooks }],
    });
  };

  if (Mutation.loading) {
    return <Spin size="large" />;
  }
  if (Mutation.data) {
    toastDefault("Sửa sách thành công");
    navigate("/admin/books");
  }
  return (
    <div>
      <Form
        form={form}
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
            <Form.Item name="image" label="Sửa ảnh">
              <Uploadimage
                imageData={imageDefault}
                uploadImageState={uploadImageState}
              />
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
                options: data2?.genres.map((genre: any) => ({
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

export default Editbook;
