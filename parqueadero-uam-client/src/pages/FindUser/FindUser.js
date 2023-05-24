import { Layout } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import React from 'react'

export const FindUser = () => {
  return (
    <Layout>
        <Header>

        </Header>
        <Content>
            <div className="content-title">
                <label>Parqueadero UAM</label>
                <label className="content-title-subtitle">
                    Parqueadero {Parqueadero}
                </label>
            </div>
        </Content>
    </Layout>
  )
}
