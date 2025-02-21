import Header from '../HOMEPAGE/Header';
import NgoSignupForm from './createngoform';
import './CreateNgo.css'

const CreateNgo = () => {
    return(
        <div className="Createngo"> 
        <Header title='DeBuggers'/>
        <NgoSignupForm/>
        </div>
    );
};
export default CreateNgo;