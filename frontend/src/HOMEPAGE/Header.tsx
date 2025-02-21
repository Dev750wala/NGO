import { useConnect } from "wagmi";
import "./header.css";

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { connectors, connect } = useConnect();

  return (
    
    <div className="mainheader">
      <h1 className="heading1">{title}</h1>
      <div className="buttonsheader">
      <button className="headerbutton">about</button>
      <button className="headerbutton">policy</button>
      {connectors.map((connector) => (
        <button 
        className="buttonwallet"
          key={connector.uid}
          onClick={() => connect({ connector })}
          type="button"
        >
          {connector.name}
        </button>
       
      ))}
       </div>
    </div>
  );
};

export default Header;