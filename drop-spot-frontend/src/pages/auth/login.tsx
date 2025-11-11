import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { loginService } from '../../features/auth/services/login';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../providers/auth-provider';

type UserLogin = {
  email: string;
  password: string;
};

export default function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const onFinish: FormProps<UserLogin>['onFinish'] = async (values) => {
    const responese = await loginService(values);
    setUser(responese.data);

    if (responese.success === true) {
      console.log(responese.data.roles);
      if (responese.data.roles === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  const onFinishFailed: FormProps<UserLogin>['onFinishFailed'] = (errorInfo) => {
    console.log(errorInfo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome</h2>
          <p className="text-gray-500">Login your account</p>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          size="large"
          autoComplete="off"
          validateTrigger="onSubmit"
        >
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              { required: true, message: 'Please enter your password' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input prefix={<MailOutlined className="text-gray-400" />} className="rounded-lg" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              className="rounded-lg"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <span className="text-gray-600">Don't have an account?</span>{' '}
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
