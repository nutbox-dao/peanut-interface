function requestBroadcastWithFee(account, address, fee, symbol, operation, needsActive = true) {
  const steemGas = process.env.VUE_APP_STEEM_GAS
  const feeOperation = [
    'transfer',
    {
      from: account,
      to: steemGas,
      amount: fee + ' ' + symbol,
      memo: 'fee: ' + operation[0] + ' ' + address
    }
  ]
  return new Promise(resolve => {
    steem_keychain.requestBroadcast(account, [feeOperation, operation],
      needsActive ? 'Active' : 'Posting', function (response) {
        resolve(response)
    });
  })
}

export async function steemWrap(from, to, amount, memo, currency, address, fee) {
  fee = parseFloat(fee).toFixed(3)
  return await requestBroadcastWithFee(from, address, fee, currency, [
    'transfer',
    {
      from,
      to,
      amount: amount + ' ' + currency,
      memo
    }
  ])
}

export async function steemDelegation(delegator, delegatee, amount, address) {
  const fee = parseFloat(process.env.VUE_APP_DELEGATE_FEE || 0.5).toFixed(3)
  return await requestBroadcastWithFee(delegator, address, fee, 'STEEM', [
    'delegate_vesting_shares',
    {
      delegator,
      delegatee,
      vesting_shares: amount + ' ' + 'VESTS'
    }
  ])
}
