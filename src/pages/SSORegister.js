import "./SSORegister.css";
import { Link } from 'react-router-dom';

const SSORegister = () => {
  return (
    <div className="sso-register">
      <img className="frame-icon" alt="" src="/frame@2x.png" />
      <div className="frame">
        <div className="register">Register</div>
      </div>
      <div className="frame1">
        <div className="register">Students</div>
      </div>
      <div className="frame2">
        <div className="register">Notification</div>
      </div>
      <div className="frame3">
        <div className="register">Feedback</div>
      </div>
      <div className="frame4">
        <div className="register">Report</div>
      </div>
      <div className="frame5">
        <div className="register">Pendings</div>
      </div>
      <div className="frame6">
        <div className="register">Sanctions</div>
      </div>
      <div className="frame7">
        <div className="register">Logout</div>
      </div>
      <img className="frame-icon1" alt="" src="/frame1.svg" />
      <div className="frame8">
        <div className="register">Logo</div>
      </div>
      <div className="sidebar" />
      <button className="frame9">
        <div className="input" />
      </button>
      <button className="frame10">
        <div className="input1" />
      </button>
      <button className="frame11">
        <div className="input1" />
      </button>
      <button className="frame12">
        <div className="input3" />
      </button>
      <button className="frame13">
        <div className="input3" />
      </button>
      <button className="frame14">
        <div className="input3" />
      </button>
      <button className="frame15">
        <div className="input6" />
      </button>
      <div className="frame16">
        <img
          className="image-removebg-preview-2-2"
          alt=""
          src="/imageremovebgpreview-2-2@2x.png"
        />
      </div>
      <div className="frame17">
        <div buttonclassName="account">Account</div>
      </div>
      <div className="frame18">
        <div className="students1">Students</div>
      </div>
      <div className="frame19">
        <div className="case">Notification</div>
      </div>
      <div className="frame20">
        <div className="case">Feedback</div>
      </div>
      <div className="frame21">
        <div className="case">case</div>
      </div>
      <div className="frame22">
        <div className="case">Pendings</div>
      </div>
      <div className="frame23">
        <div className="case">Sanctions</div>
      </div>
      <img className="frame-icon2" alt="" src="/image-removebg-preview (1).png" />
      <div className="frame24">
        <img
          className="image-removebg-preview-4-1"
          alt=""
          src="/imageremovebgpreview-4-1@2x.png"
        />
      </div>
      <div className="frame25">
        <img
          className="image-removebg-preview-5-1"
          alt=""
          src="/imageremovebgpreview-5-1@2x.png"
        />
      </div>
      <div className="frame26">
        <img
          className="image-removebg-preview-6-1"
          alt=""
          src="/imageremovebgpreview-6-1@2x.png"
        />
      </div>
      <button className="frame27">
        <div className="input3" />
      </button>
      <div className="frame28">
        <div className="case">Report</div>
      </div>
      <div className="frame29">
        <img
          className="image-removebg-preview-8-1"
          alt=""
          src="/imageremovebgpreview-8-1@2x.png"
        />
      </div>
      <div className="frame30">
        <img
          className="image-removebg-preview-1-1"
          alt=""
          src="/imageremovebgpreview-1-1@2x.png"
        />
      </div>
      <div className="frame31">
        <img
          className="image-removebg-preview-9-1"
          alt=""
          src="/imageremovebgpreview-9-1@2x.png"
        />
      </div>
      <div className="frame32">
        <img
          className="image-removebg-preview-10-1"
          alt=""
          src="/imageremovebgpreview-10-1@2x.png"
        />
      </div>
      <div className="frame33">
        <img
          className="image-removebg-preview-3-2"
          alt=""
          src="/imageremovebgpreview-3-2@2x.png"
        />
      </div>
      <div className="frame34">
        <div className="frame-child" />
      </div>

      <div className="frame37">
      <Link to="/register/principal">
        <button type="submit" className="But">Principal</button>
        </Link>
      </div>
 
      <div className="frame39">
      <Link to="/register/adviser">
        <button type="submit"className="But">Adviser</button>
      </Link>
      </div>
      <div className="frame40">
        <div className="choose-account-register">Choose Account Register</div>
      </div>
      <div className="image-removebg-preview-1-parent">
        <img
          className="image-removebg-preview-1-icon"
          alt=""
          src="/imageremovebgpreview-1@2x.png"
        />
        <div className="user-name">
          <div className="sso">SSO</div>
          <div className="frame42">
            <div className="admin">Admin</div>
          </div>
        </div>
        <button className="log-out">
          <img className="vector-icon" alt="" src="/vector.svg" />
          <img className="vector-icon1" alt="" src="/vector1.svg" />
          <img className="vector-icon2" alt="" src="/vector2.svg" />
        </button>
      </div>
      <div className="frame43">
      <Link to="/register/sso">
        <button type="submit" className="But">SSO Officer</button>
      </Link>
      </div>
    </div>
  );
};

export default SSORegister;
