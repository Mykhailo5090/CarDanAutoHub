import '../main/mainpage.scss';
import porschesubheader from '../main/img/porschesubheader.jpg';
import logo from '../header/img/porschelogo.png';

const MainPage = () => {
  return (
    <div className='main'>
        <div className='main_item main_item_1'>
        <img className="porsche_sub_header_img" src={porschesubheader} alt="porsche" />
         <div className='main_wrapper main_comp_1'>
            <p className='p_main_porsche_1'>CarDan AutoHub - Official Distributor</p>
            <p className='p_main_porsche_2'>Of Porsche</p>


            <div className='porsche_right_under_container'>
            <div className='porsche_right_under'>
            <img className="porsche_logo" src={logo} alt="porsche" />
            <p className='porsche_font'>Porsche</p>

            </div>
            </div>
            
            </div>


        </div>



    </div>
    
  );
}

export default MainPage;