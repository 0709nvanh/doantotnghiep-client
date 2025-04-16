import { Form, Input } from "antd";
import { FormItemWithInputProps } from "..";

export function InputDisableFormItem({
  formItemProps,
  inputProps,
}: FormItemWithInputProps) {
  return (
    <Form.Item className={"m-0"} {...formItemProps}>
      <Input
        className={"!text-black !pl-0"}
        disabled
        variant={"borderless"}
        {...inputProps}
      />
    </Form.Item>
  );
}
