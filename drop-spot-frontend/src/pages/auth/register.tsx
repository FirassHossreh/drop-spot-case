import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { registerService } from '../../features/auth/services/register';
import { useNavigate } from 'react-router-dom';

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

  const onFinish: FormProps<UserRegister>['onFinish'] = async (values) => {
    const respones = await registerService(values);
    if (respones.success === true) {
      if (respones.data.roles === 'admin') {
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Hesap Oluştur</h2>
          <p className="text-gray-500">Yeni bir hesap oluşturun</p>
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
            label="İsim"
            name="name"
            rules={[{ required: true, message: 'Lütfen isminizi giriniz!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="İsim"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label="Soyisim"
            name="surName"
            rules={[{ required: true, message: 'Lütfen soyisminizi giriniz!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Soyisim"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              { required: true, message: 'Lütfen e-mail adresinizi giriniz!' },
              { type: 'email', message: 'Geçerli bir e-mail giriniz!' },
            ]}
          >
            <Input prefix={<MailOutlined className="text-gray-400" />} className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label="Şifre"
            name="password"
            rules={[
              { required: true, message: 'Lütfen şifrenizi giriniz!' },
              { min: 6, message: 'Şifre en az 6 karakter olmalıdır!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label="Şifre Tekrar"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Lütfen şifrenizi tekrar giriniz!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Şifreler eşleşmiyor!'));
                },
              }),
            ]}
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
              Kayıt Ol
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <span className="text-gray-600">Zaten hesabınız var mı?</span>{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Giriş Yap
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
