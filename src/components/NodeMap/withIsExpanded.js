import React from 'react';
import { connect } from 'react-redux';
import { enqueueSnackbar } from '../../ducks/notification';
import { fetchTerminalsStateById } from '../../ducks/widgets';

function withIsExpanded(WrappedComponent) {
  class HOComponent extends React.Component {
    state = {
      isExpanded: this.props.active,
      touched: false
    }
  
    setExtended = () => {
      this.setState((prevState) => ({
        isExpanded: !prevState.isExpanded,
        touched: true
      }));
    }
    render() {
      let { active} = this.props;

      let { isExpanded, touched } = this.state;

      isExpanded = !touched ? active : isExpanded;

      return <WrappedComponent 
        {...this.props} 
        isExpanded={isExpanded}
        setExtended={this.setExtended}
      />;
    }
  };

  const mapStateToProps = state => ({
    terminals: state.widgets.terminals.data,
    loading: state.widgets.terminals.loading,
    current: state.merchants.current,
  });

  return connect(
    mapStateToProps, 
    { 
      enqueueSnackbar,
      fetchTerminalsStateById
    }
  )(HOComponent);
}

export default withIsExpanded;