/*
 * @Author: juncheng.wu juncheng.wu@bst.ai
 * @Date: 2023-03-16 09:33:51
 * @LastEditors: juncheng.wu juncheng.wu@bst.ai
 * @LastEditTime: 2023-03-16 19:41:14
 * @Description: 
 */
import './App.css';
// import RefStr from './refTest/RefStr';
// import RefObj from './refTest/RefObj';
// import RefFun from './refTest/RefFun';
// import ForwardRef from './refTest/ForwardRef';
// import DidMount from './refTest/DidMount';
// import OldContext from './context/OldContext';
// import NewContext from './context/NewContext';
// import Test from './context/Form/Test';
// import TaskContainer from './PureComponent/TaskContainer';
// import MovablePanel from './renderProps/MovablePanel';
// import RenderPropsTest from './renderProps/RenderPropsTest';
// import Portals from './Portals/Portals';
// import Timer from './components/Timer';
import ReducerTest from './Hooks/Reducer/ReducerTest';
function App() {
  // console.log(RefFun) // 类
  // console.log(<RefFun />) // 类实例
  console.log("App render")
  return (
    <div className="App">
      {/* hello react */}
      {/* <RefStr></RefStr> */}
      {/* <RefObj></RefObj> */}
      {/* <RefFun></RefFun> */}
      {/* <DidMount /> */}
      {/* <NewContext /> */}
      {/* <Test /> */}
      {/* <TaskContainer /> */}
      {/* <MovablePanel /> */}
      {/* <RenderPropsTest /> */}
      {/* <Portals /> */}
      {/* <Timer /> */}
      {/* <ForwardRef/> */}
      <ReducerTest />
    </div>
  );
}

export default App;
