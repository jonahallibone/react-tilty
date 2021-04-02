import ReactDOM from '../../node_modules/react-dom';
import Tilty from 'react-tilty';
import './index.css';

ReactDOM.render(
  <div className="app">
    <Tilty className="tilty" glare scale={1.05} maxGlare={0.5}>
      <div className="inner">react-tilty</div>
    </Tilty>
  </div>,
  document.getElementById('root')
);
