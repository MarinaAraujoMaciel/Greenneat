import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';

function ResetarSenha() {
  const [serverError, setServerError] = useState('');

  const validationSchema = yup.object({
    password: yup
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .required('A senha é obrigatória'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'As senhas não coincidem')
      .required('Confirmação de senha é obrigatória'),
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        const response = await axios.post('http://localhost:3001/resetarSenhaEstabelecimento', {
          token: token,
          newPassword: values.password,
        });

        if (response.status === 200) {
          // Senha redefinida com sucesso
          console.log('Senha redefinida com sucesso');
          alert('Senha redefinida com sucesso! Redirecionando para a página de login...');
          // Redirecionar o usuário para a página de login, por exemplo
          window.location.href = 'http://localhost:3000/login';
        } else {
          // Exibir mensagem de erro caso ocorra algum problema na troca de senha
          console.log('Ocorreu um erro ao redefinir a senha');
          setServerError('Ocorreu um erro ao redefinir a senha. Por favor, tente novamente.');
        }
      } catch (error) {
        console.log('Ocorreu um erro:', error);
        setServerError('Ocorreu um erro. Por favor, tente novamente.');
      }
    },
  });

  return (
    <div className='recuperar'>
      <div className='recBorder'>
        <div className='recContainer'>
          <h1>Redefinição de Senha</h1>
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="password">Nova senha:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.password && formik.errors.password && (
              <div className="error">{formik.errors.password}</div>
            )}

            <label htmlFor="confirmPassword">Confirmar senha:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="error">{formik.errors.confirmPassword}</div>
            )}

            <div className='recSessao1'>
              <button className='recBtn' type="submit">Redefinir</button>
            </div>
          </form>
          {serverError && <div className="error">{serverError}</div>}
        </div>
      </div>
    </div>
  );
}

export default ResetarSenha;
