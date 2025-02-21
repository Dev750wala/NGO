import { useConnect, useAccount, useDisconnect } from "wagmi";
import "./header.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate(); 

  return (
    <div className="mainheader">
      <h1 className="heading1">{title}</h1>
      <div className="buttonsheader">
      <button className="headerbutton" onClick={() => navigate("/")}>
          Home
        </button>
        <button className="headerbutton">about</button>
        <button className="headerbutton">policy</button>

        {isConnected ? (
          <div className="wallet-container">
            <button
              className="buttonwallet"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {(address as string).slice(0, 6)}...{(address as string).slice(-4)}
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => disconnect()}>
                  Disconnect
                </button>
              </div>
            )}
          </div>
        ) : (
          connectors.map((connector) => (
            <button
              className="buttonwallet"
              key={connector.uid}
              onClick={() => connect({ connector })}
              type="button"
            >
              {connector.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Header;