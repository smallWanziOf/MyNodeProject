import React,{Component} from "react";
export default class Pagination extends Component{

  constructor(prop){
    super(prop);
    this.state={
      total:0,
      pageSize:10,
      current:1,
      activePageClass:'activePage',
      canRender:false,
      ele:[],
      originEle:[],
      showPrefix:false,
      showSuffix:false,
      LiIndex:0,
      count:0,
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      total:nextProps.total,
      pageSize:nextProps.pageSize,
      current:nextProps.current,
      LiIndex:nextProps.current,
    },()=>{this.renderLi()})
  }

  handleChangeLi = (e,d,m) => {
    let k = null;

    if(e!=null){
      k = parseInt(e.target.innerHTML);
    }else{
      if(d>this.state.originEle.length){
        k = this.state.originEle.length
      }else if(d<0){
        k = 1;
      }else{
        k = d;
      }
    }
    if(m === 'move' || e!=null){
      this.props.onChange(k,this.state.pageSize);
    }
    if(this.state.count<=5){
      let newEle = TANGJG.deepCopy(this.state.originEle);
      newEle[k-1]=<li className="activePage" key={k-1} onClick={e=>this.handleChangeLi(e)}>{k}</li>;
      this.setState({
        ele:newEle,
        LiIndex:k,
      })
    }else{
      if(k-3<=0){
        let newEle = this.state.originEle.slice(0,5);
        newEle[k-1]=<li className="activePage" key={1000} onClick={e=>this.handleChangeLi(e)}>{k}</li>
        this.setState({
          showPrefix:false,
          showSuffix:true,
          ele:newEle,
          LiIndex:k,
        })
      }else if(this.state.originEle[k+2] != undefined || k+2 < this.state.originEle.length){
        let newEle = this.state.originEle.slice(k-3,k+2);
        newEle[2]=<li className="activePage" key={1000} onClick={e=>this.handleChangeLi(e)}>{k}</li>
        this.setState({
          showPrefix:true,
          showSuffix:true,
          ele:newEle,
          LiIndex:k,
        })
      }else{
        let newEle = this.state.originEle.slice(this.state.originEle.length-5,this.state.originEle.length+1);
        newEle[5-(this.state.originEle.length-k)-1]=<li className="activePage" key={1000} onClick={e=>this.handleChangeLi(e)}>{k}</li>;
        this.setState({
          showSuffix:false,
          ele:newEle,
          LiIndex:k,
        })
      }
    }
  }

  handleLeft = () => {
    if(this.state.LiIndex>1){
      this.handleChangeLi(null,--this.state.LiIndex,'move')
    }
  }

  handleRight = () => {
    if(this.state.LiIndex<this.state.originEle.length){
      this.handleChangeLi(null,++this.state.LiIndex,'move')
    }
  }

  renderLi = () => {
    let {total,pageSize} = this.state;
    let count = Math.ceil(total/pageSize);
    let ele = [];
    for(var i=0;i<count;i++){
      ele.push(<li key={i} onClick={e=>this.handleChangeLi(e)}>{i+1}</li>)
    }
    this.setState({
      originEle:Object.assign([],ele),
      count
    },()=>{this.showLiCount(count)});
  }

  showLiCount = (count) => {
    if(count>5){
      this.setState({
        canRender:true,
      },()=>{this.handleChangeLi(null,this.state.LiIndex)});
    }else{
      this.setState({
        ele:this.state.originEle,
        canRender:true,
        showPrefix:false,
        showSuffix:false,
      },()=>{this.handleChangeLi(null,this.state.LiIndex)});
    }
  }

  render(){
    let {canRender,total,pageSize,ele,showPrefix,showSuffix} = this.state;
    return (
      <div id="Pagination">
        {
          canRender&&
          <ul>
            <li onClick={this.handleLeft}><i className="fa fa-angle-left" aria-hidden="true"></i></li>
            <li className={showPrefix?'':'hiddenDou'}>...</li>
            {
              ele.map((item,i)=>{
                return item
              })
            }
            <li className={showSuffix?'':'hiddenDou'}>...</li>
            <li onClick={this.handleRight}><i className="fa fa-angle-right" aria-hidden="true"></i></li>
          </ul>
        }
      </div>
    )
  }
}
