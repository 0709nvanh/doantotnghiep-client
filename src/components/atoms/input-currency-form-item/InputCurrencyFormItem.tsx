import { Form, InputNumber } from "antd";
import { FormItemWithInputCurrencyProps } from "..";

export function InputCurrencyFormItem(props: FormItemWithInputCurrencyProps) {
  return (
    <Form.Item className={"m-0"} {...props.formItemProps}>
      <InputNumber
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) =>
          value?.replace(/\$\s?|(,*)/g, "") as unknown as number
        }
        className={"!text-black w-full !pl-0"}
        {...props.inputCurrencyProps}
      />
    </Form.Item>
  );
}
