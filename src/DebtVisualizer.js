import React, { Component } from 'react';
import './dv.css';
import debts from './mockData/debtmock';

class DebtVisualizer extends Component {
  constructor () {
    super()
    this.setDebtContainerRef = this.setDebtContainerRef.bind(this)
    this.toggleEdit = this.toggleEdit.bind(this)
    this.updateItem = this.updateItem.bind(this)
    this.saveItemEdit = this.saveItemEdit.bind(this)
    this.state = {
      debt: debts,
      debtEditStates: debts.reduce((acc, item, idx) => {acc[idx] = false; return acc}, {}),
      editItems: debts.slice()
    }
    this.debtItemRefs = {};
  }
  componentDidMount () {
    this.setState({containerHeight: this.containerHeight}) 
  }
  setDebtContainerRef (node) {
    this.debtContainerRef = node;
    this.containerHeight = node.clientHeight;
  }
  toggleEdit (index, event) {
    if(this.debtItemRefs[index] &&!this.debtItemRefs[index].contains(event.target)){
      this.setState({ debtEditStates: {...this.state.debtEditStates, [index] : !this.state.debtEditStates[index] }})    
    }
  }
  generateDebtItemRef (node, index) {
    this.debtItemRefs[index] = node
  }
  saveItemEdit () {
    //Will need to update to save to mongoDB through redux action
    this.setState({debt: this.state.editItems})
  }

  updateItem (event, idx) {
    const stateCopy = [...this.state.editItems];
    stateCopy.splice(idx, 1, { ...stateCopy[idx], payoffAmount: Number(event.target.value)})
    this.setState({
      editItems: stateCopy
    }) 
  }
  generateDebtItems (items, totalDebt) {
    return items.map((item, idx) => {
      const percentagePaidOff = Math.floor(100 - (item.payoffAmount / item.totalAmount * 100));
      const itemAmountHeight = (item.totalAmount / totalDebt) * this.containerHeight;
      const payoffHeight = (item.payoffAmount / item.totalAmount) * itemAmountHeight + 'px';
      const editPanelPosition = (item.totalAmount / totalDebt) * 100 + 5 +'%'
      return <div  onClick={ (e) => {this.toggleEdit(idx, e)}} key={idx} className='debt-item'>
        <h2 style={{bottom: itemAmountHeight / 2 +'px'}} className='item-percentage'>{percentagePaidOff}%</h2>
        <div style={{maxHeight: itemAmountHeight+'px'}} className='dv-total'></div>
        <div style={{maxHeight: payoffHeight}} className='dv-payoff'></div>        
        <div className='dv-content'>
          <p>{item.name}</p>
          <p><b>Total Amount:</b> {item.totalAmount.toLocaleString()}</p>
          <p><b>Total Payoff:</b> {item.payoffAmount.toLocaleString()}</p>
        </div>
        {<div style={{bottom: editPanelPosition, display: (this.state.debtEditStates[idx] ? 'block' : 'none')}} 
          ref={(node) => {this.generateDebtItemRef(node, idx)}} className='edit-panel'>
          <small>Update Payoff Amount</small>
          <input value={this.state.editItems[idx].payoffAmount} onChange={ (e) => {this.updateItem(e, idx)}} type='text' />
          <button type='button' onClick={this.saveItemEdit}>Save</button>
        </div>
        }
      </div>
    }, this)
  }
  render() {
    const {debt} = this.state
    const totalDebt = debt.reduce((acc, item) => acc + item.totalAmount, 0);
    const totalPaid = totalDebt - debt.reduce((acc, item) => acc + item.payoffAmount, 0)
    return (
      <div className="dv-container">
        <h1 className='app-title'>Debt Visualizer</h1>
        <h3>Total Debt Left: <span className='debt-total'>-${ (totalDebt - totalPaid).toLocaleString()}</span></h3>
        <h3>Total Paid: <span>${totalPaid.toLocaleString()}</span></h3>
        
        <div ref={this.setDebtContainerRef} className='dv-items-container'>
          {this.generateDebtItems(debt, totalDebt)}
        </div>
      </div>
    );
  }
}

export default DebtVisualizer;
