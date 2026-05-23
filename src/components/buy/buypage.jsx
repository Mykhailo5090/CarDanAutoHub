import '../main/mainpage.scss';
import porschesubheader from '../main/img/porschesubheader.jpg';


const MainPage = () => {
  return (
    <div className='main'>
        <div className='main_item main_item_1'>
        <img className="porsche_sub_header_img" src={porschesubheader} alt="porsche" />
         <div className='main_wrapper main_comp_1'>
            


            <div className='porsche_right_under_container'>
            <div className='porsche_right_under'>
            <p className='porsche_font'>Porsche</p>

            </div>
            </div>
            
            </div>


        </div>



    </div>
    
  );
}

export default MainPage;