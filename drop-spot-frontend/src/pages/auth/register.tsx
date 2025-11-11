import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { registerService } from '../../features/auth/services/register';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../providers/auth-provider';

type UserRegister = {
  name: string;
  surName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const onFinish: FormProps<UserRegister>['onFinish'] = async (values) => {
    const response = await registerService(values);
    console.log(response);
    setUser(response.data);

    if (response.success === true) {
      if (response.data.roles === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  const onFinishFailed: FormProps<UserRegister>['onFinishFailed'] = (errorInfo) => {
    console.log(errorInfo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-500">Create a new account</p>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          size="large"
          autoComplete="off"
          validateTrigger="onSubmit"
        >
          <Form.Item
            label="First Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your first name!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="First Name"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="surName"
            rules={[{ required: true, message: 'Please enter your last name!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Last Name"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email address!' },
              { type: 'email', message: 'Please enter a valid email address!' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Email"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Confirm Password"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <span className="text-gray-600">Already have an account?</span>{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
