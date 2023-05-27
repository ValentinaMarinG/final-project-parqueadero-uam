import { Button, Layout } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { LayoutGeneral } from '../LayoutGeneral'


export const AdminDelegates = () => {
  return (
    <Layout>
      <div><Button><Link to={'../admin/delegates/register'}>Añadir</Link></Button></div>
    </Layout>
  )
}
