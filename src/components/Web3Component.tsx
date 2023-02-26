import { useState } from "react";
import Web3 from "web3";
import { Button, Divider, Space, Typography } from "antd";
import { useBoolean, useSetState } from "ahooks";
import { Transaction } from "@ethereumjs/tx"

const { Text } = Typography

const Web3Component = () => {

  const [web3Url] = useState("wss://abb")
  // 每次转账数量
  const [transactionCount] = useState("0.000001")
  // 查询余额的loading
  const [isSearchAccountMountLoading, setSearchLoadingProps] = useBoolean(false);
  // 转账的loading
  const [isTransactionAccountMountLoading, setTransactionLoadingProps] = useBoolean(false);

  const [web3AccountInfos, setWeb3AccountInfos] = useSetState({
    address: "1", // ???
    address2: "1",
    address3: "1",
    privateKey: "1",
    mount: "-999",
    ethCount: "0.03",
    ethToWeiUnit: ""
  })

  const [transactionInfos, setTransactionInfos] = useSetState({
    nonce: -1,
    gas: "",
    value: ""
  })

  const web3 = new Web3(Web3.givenProvider || web3Url)


  // 创建账户
  const useCreateWeb3Account = async () => {
    const account = web3.eth.accounts.create('123')
    setWeb3AccountInfos({
      address: account.address,
      privateKey: account.privateKey
    })
  }

  // 查询账户
  const useGetWeb3AccountMount = async () => {
    setSearchLoadingProps.setTrue()
    const mount = await web3.eth.getBalance(web3AccountInfos.address);
    setWeb3AccountInfos({
      mount: web3.utils.fromWei(mount)
    })
    setSearchLoadingProps.setFalse()
  }


  // 单位转化
  const useSetCountToWei = async () => {
    const ethToWeiUnit = web3.utils.toWei(web3AccountInfos.ethCount)
    setWeb3AccountInfos({
      ethToWeiUnit
    })
  }

  // 转账操作
  const useSendTransaction = async () => {
    setTransactionLoadingProps.setTrue()
    // 获取转账交易次数
    const nonce = await web3.eth.getTransactionCount(web3AccountInfos.address)
    // 获取预计转账的费用
    const expectedGas = await web3.eth.getGasPrice()
    // 转账的金额
    const transactionMountWithWei = web3.utils.toWei(transactionCount)
    // 设置
    setTransactionInfos({
      nonce,
      gas: web3.utils.fromWei(expectedGas),
      value: transactionMountWithWei
    })
    // 开始构建转账参数
    const rawTx = {
      from: web3AccountInfos.address2,
      to: web3AccountInfos.address3,
      nonce,
      expectedGas,
      value: transactionMountWithWei,
      data: "0x0000"
    }

    // 私钥转化
    const privateKey = Buffer.from(web3AccountInfos.privateKey.slice(2), 'hex')
    console.log(privateKey)
    setTransactionLoadingProps.setFalse()
  }

  return (
    <>
      <Space direction="vertical">
        <Space className="mb-2">
          <Button danger type="primary" onClick={() => useCreateWeb3Account()}>创建web3账户</Button>
          <Button disabled={isSearchAccountMountLoading} loading={isSearchAccountMountLoading} onClick={() => useGetWeb3AccountMount()}>查询web3账户余额</Button>
          <Button onClick={() => useSetCountToWei()}>转化web3余额到wei</Button>
          <Button disabled={isTransactionAccountMountLoading} loading={isTransactionAccountMountLoading} type="primary" onClick={() => useSendTransaction()}>web3转账</Button>
        </Space>
        <Space className="mb-2">
          <Button danger type="primary" onClick={() => useCreateWeb3Account()}>创建web3账户</Button>
          <Button disabled={isSearchAccountMountLoading} loading={isSearchAccountMountLoading} onClick={() => useGetWeb3AccountMount()}>查询web3账户余额</Button>
          <Button onClick={() => useSetCountToWei()}>转化web3余额到wei</Button>
          <Button disabled={isTransactionAccountMountLoading} loading={isTransactionAccountMountLoading} type="primary" onClick={() => useSendTransaction()}>web3转账</Button>
        </Space>
        <Text type="danger" mark>
          地址：{web3AccountInfos.address}
        </Text>
        <Text type="danger" mark>
          秘钥：{web3AccountInfos.privateKey}
        </Text>
        <Text type="danger" mark>
          余额：{web3AccountInfos.mount}
        </Text>
        <Text type="danger" mark>
          eth余额：{web3AccountInfos.ethCount}
        </Text>
        <Text type="danger" mark>
          wei余额：{web3AccountInfos.ethToWeiUnit}
        </Text>
        <Divider>转账相关的参数</Divider>
        <Text type="danger" mark>
          账户转账次数：{transactionInfos.nonce}
        </Text>
        <Text type="danger" mark>
          转账数量：{transactionInfos.value} wei
        </Text>
        <Text type="danger" mark>
          预计转账gas费用：{transactionInfos.gas}
        </Text>
        
      </Space>
    </>
  );
}

export default Web3Component;