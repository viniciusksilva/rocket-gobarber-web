import React, { useCallback, useRef } from 'react';
import  { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimationContainer } from './styles';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const Signup: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback(async(data: SignUpFormData) => {
        try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string().required('Email obrigatório').email('Digite um email valido'),
                password: Yup.string().min(6, 'No mínimo 6 dígitos')
            });

            await schema.validate(data, {
                abortEarly: false
            });

            await api.post('/users', data);

            history.push('/');

            addToast({
                type: 'success',
                title: 'Cadastro realizado',
                description: 'Você já pode fazer seu logon no GoBarber'
            })

        } catch (error) {
            if (error instanceof Yup.ValidationError){
                const errors = getValidationErrors(error);
                formRef.current?.setErrors(errors);
                return;
            }
            
            addToast({
                type: 'error',
                title: 'Erro no cadastro',
                description: 'Ocorreu um erro no cadastro, tente novamente.'
            });
        }
    }, [addToast, history]);


    return (
        <Container>
            <Background />
            <Content>
                <AnimationContainer>
                <img src={logoImg} alt="Logo" />
        
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1> Faça seu logon</h1>
        
                        <Input name="name" icon={FiUser} placeholder="name" />
                        <Input name="email" icon={FiMail} placeholder="email" />
        
                        <Input name="password"  icon={FiLock} type="password" placeholder="Senha" />
        
                        <Button type="submit">Cadastrar</Button>
        
                    </Form>
        
                    <Link to="/">
                        <FiArrowLeft />
                    Voltar pa ra logon
                    </Link>
                </AnimationContainer>
            </Content>
        </Container>
    );
}

export default Signup;