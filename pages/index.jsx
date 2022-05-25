import Head from 'next/head'
import Image from 'next/image'

//importar as configurações do firebase
import { app, database } from '../services/firebase'
import { collection, addDoc, GetDocs, getDocs, orderBy, query } from 'firebase/firestore'
import { useState, useEffect } from 'react'

//definir a coleção 
const contato = collection(database,'contato')

export default function Home() {

  //hooks
  const [nome, SetNome]=useState('')
  const [email, SetEmail]=useState('')
  const [telefone, Settelefone]=useState('')
  const [mensagem, SetMensagem]=useState('')

  //creat
  const create = ()=>{
    addDoc(contato,{
      nome: nome,
      email: email,
      telefone: telefone,
      mensagem: mensagem
    }).then(()=>{
      SetNome('')
      SetEmail('')
      Settelefone('')
      SetMensagem('')
      read('')
    })
  }

  //read
  const [lista,setLista] = useState([])
  const read = ()=>{
    getDocs(query(contato,orderBy('nome')))
    .then((data)=>{
      setLista(data.docs.map((item)=>{
        return{...item.data(),id:item.id} 
      }))
    })
  }
  //Mostrar documentos ao atualizar a página
  useEffect(()=>{
    read()
  },[])
  
  return (
    <>
    <Head>
      <title>Crud Simples com firestore</title>
    </Head>
    <main className="container">
      <div className="row">
        <div className="col-md"><h3 className="text-center">Cadastrar</h3><br />

        <input type="text" placeholder="Nome" className="form-control" required onChange={event=>SetNome(event.target.value)} value = {nome} /><br />

        <input type="email" placeholder="Email" className="form-control" required onChange={event=>SetEmail(event.target.value)} value = {email} /><br />

        <input type="tel" placeholder="Telefone" className="form-control" required onChange={event=>Settelefone(event.target.value)} value = {telefone} /><br />

        <textarea placeholder="Mensagem" className="form-control" required onChange={event=>SetMensagem(event.target.value)} value = {mensagem} ></textarea><br />
        
        <input type="submit" value="Salvar" className="btn btn-outline-dark form-control" onClick={create} />
        </div>
        <div className="col-md"><h3 className="text-center">Exibir</h3>
        {lista.map((lista)=>{
          return(
            <>
            <div className="card">
              <div className="card-header bg-dark text-light">
                Id: {lista.id}
              </div>

              <div className="card-body">
                <p className="card-title text-info">Nome: {lista.nome}</p>
                <p className="card-subtitle">Email: {lista.email}</p>
                <p className="card-subtitle">Telefone: {lista.telefone}</p>
                <p className="card-subtitle">Mensagem: {lista.mensagem}</p>
              </div>
              <div className="card-footer">
                <div className="input-group">
                 <input type="button" value="Alterar" className="btn btn-outline-warning form-control" />
                 <input type="button" value="Excluir" className="btn btn-outline-danger form-control" />
                </div>
              </div>
            </div>
            
            </>
          )
        })}
        </div>
      </div>
    </main>
    </>
  )
}