import React from "react";
import {
  Text,
  Heading,
  Input,
  Button,
  Center,
  Box,
  PinInput,
  PinInputField,
  Spinner,
} from "@chakra-ui/react";
import { auth } from "../../Firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  authLoading,
  authSuccess,
  authError,
  authOtphandle,
  otpLoading,
} from "../../Redux/Auth/auth.action";
import "./Signup.css";
import { useState } from "react";



function Signup() {
  const [Number, setNumber] = useState("");
  const [Authinicated, setAuthinicated] = useState(true);
  const [Otp, setOtp] = useState("");
  const { loading, isAuth, error } = useSelector((store) => store.auth);
  const { token,loading2 } = useSelector((store) => store.otpVerify);
  // console.log(token);
  const dispatch = useDispatch();

  const Navigate = useNavigate();
  console.log(loading);
  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      },
      auth
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(Number);
    dispatch(authLoading());
    generateRecaptcha();
    let appVerifier = window.recaptchaVerifier;
    if (Number === "" || Number === undefined) {
      let data = "Please Enter Mobile Number";
      dispatch(authError(data));
      return;
    }

    if (Number.length > 10) {
      if (Number[0] !== "0") {
        dispatch(authError("Please Enter a Valid mobile Number"));
        return;
      } else if (Number.length < 10) {
        dispatch(authError("Please Enter a Valid mobile Number"));
        return;
      }
    }

    const phoneNumber = "+91" + Number;
    console.log(phoneNumber);
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log(confirmationResult);
        setAuthinicated(false);
        dispatch(authSuccess(Number));
      })
      .catch((error) => {
        dispatch(authError(""));
        Navigate("/error");
      });
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    dispatch(otpLoading());
    if (Otp.length !== 6) {
      dispatch(authError(""));
      return;
    }
    let confirmationResult = window.confirmationResult;
    confirmationResult
      .confirm(Otp)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        console.log("otp verify");
        let data={"mobile":Number}
        dispatch(authOtphandle(data));
        if (loading2 === false) {
          dataExist();
          } 
      })
      .catch((error) => {
        console.log("error");
        Navigate("/error");
      });
  };

  const dataExist = () => {
    
    if (token) {
      Navigate("/")
    } else{ 
    Navigate("/users/signup")
   }
    
  }

  return (
    <div className="Sign-up">
      <Text mb="30px">Signin/Signup </Text>
      <Center mb="40px">
        <svg
          width="76"
          height="23"
          viewBox="0 0 76 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M71.7211 1.55787L70.5518 6.81569C70.5256 6.93815 70.4582 7.04792 70.3608 7.12669C70.2634 7.20545 70.1419 7.24842 70.0165 7.24843H68.3536C68.2785 7.24848 68.2042 7.23311 68.1353 7.20328C68.0664 7.17345 68.0043 7.1298 67.953 7.07502C67.9017 7.02025 67.8622 6.95552 67.8369 6.88486C67.8116 6.8142 67.8012 6.7391 67.8062 6.66423C67.8062 6.59586 67.8062 6.56816 67.8062 6.5673C67.8867 4.85191 66.8032 3.57099 64.3511 3.57099C60.2742 3.57099 57.3095 6.91436 56.9206 11.305C56.5195 15.8392 59.6922 18.4746 64.0818 18.4738C65.7875 18.4787 67.4841 18.2257 69.114 17.7234C69.2047 17.6948 69.3013 17.6902 69.3944 17.71C69.4874 17.7298 69.5737 17.7735 69.6449 17.8366C69.716 17.8997 69.7695 17.9802 69.8002 18.0702C69.8309 18.1602 69.8377 18.2566 69.8199 18.35L69.3002 21.0668C69.2791 21.1801 69.2277 21.2856 69.1515 21.3721C69.0752 21.4587 68.977 21.523 68.8672 21.5583C67.9673 21.8448 65.4407 22.5182 61.5734 22.5182C52.3863 22.5182 48.6593 17.2387 49.2353 11.8563C49.7524 7.06322 52.9268 2.79799e-06 65.4425 2.79799e-06C67.4111 -0.000999326 69.3706 0.267192 71.2664 0.797114C71.4257 0.840902 71.5619 0.944479 71.6467 1.08623C71.7314 1.22798 71.758 1.39695 71.7211 1.55787ZM19.4861 0.809231L19.1821 2.18016C19.1494 2.32777 19.1735 2.4823 19.2498 2.61289C19.3261 2.74349 19.4488 2.84053 19.5935 2.88466C20.1228 3.08892 20.2405 3.59609 19.7789 3.97604L12.0919 10.3598L13.4119 4.34387C13.6371 3.42126 14.3707 3.04564 14.835 2.89072L14.9103 2.86735C15.0105 2.83638 15.1007 2.77947 15.1717 2.7024C15.2428 2.62533 15.2922 2.53085 15.3148 2.42855L15.6301 1.0031C15.6475 0.923843 15.6469 0.841689 15.6282 0.76272C15.6095 0.683752 15.5733 0.609994 15.5222 0.546908C15.4712 0.483823 15.4065 0.433027 15.3332 0.398283C15.2598 0.363539 15.1795 0.345737 15.0983 0.346196H5.18797C5.05211 0.346295 4.92035 0.392642 4.81438 0.477599C4.70842 0.562556 4.63459 0.681052 4.60506 0.813558L4.28459 2.25719C4.25362 2.39947 4.27638 2.54816 4.34849 2.67469C4.42059 2.80122 4.53696 2.89666 4.67521 2.94265L4.77309 2.9764C5.39497 3.2196 6.1156 3.76746 5.81245 5.20762L3.44443 16.0158C2.82601 18.968 1.82476 19.5712 0.869411 19.6811H0.839096C0.714786 19.6959 0.598096 19.7487 0.505047 19.8324C0.411998 19.9161 0.347153 20.0265 0.319414 20.1485L0.0128017 21.5332C-0.00515434 21.6167 -0.00421017 21.703 0.015565 21.786C0.0353402 21.869 0.0734457 21.9466 0.12709 22.013C0.180735 22.0793 0.248561 22.1329 0.325599 22.1697C0.402637 22.2065 0.486938 22.2256 0.572326 22.2256H10.9902C11.112 22.2255 11.2303 22.1845 11.3259 22.1092C11.4216 22.0338 11.4891 21.9285 11.5177 21.8102L11.878 20.19C11.9062 20.0622 11.8879 19.9285 11.8263 19.813C11.7647 19.6975 11.6639 19.6078 11.5419 19.5599L11.4744 19.5331C10.9469 19.3193 10.2271 18.8641 10.4108 18.0055L11.6234 12.4786C15.7765 20.0524 17.1476 22.2343 22.1305 22.2334H26.6266C26.7498 22.2335 26.8693 22.1916 26.9655 22.1146C27.0617 22.0377 27.1288 21.9303 27.1558 21.8102L27.4711 20.4064C27.4903 20.3222 27.4906 20.2347 27.4719 20.1503C27.4533 20.066 27.4161 19.9868 27.363 19.9186C27.31 19.8503 27.2424 19.7947 27.1652 19.7557C27.0881 19.7168 27.0032 19.6954 26.9167 19.6932C25.7908 19.6759 25.239 19.4154 24.12 17.977L18.3472 10.1694L25.8496 3.93796C26.8561 3.15123 28.0843 2.93053 28.7642 2.83966L28.8326 2.83273C28.9486 2.82184 29.0582 2.77452 29.1457 2.69756C29.2331 2.62059 29.2939 2.51794 29.3194 2.40432L29.626 1.01954C29.6447 0.938882 29.6448 0.855052 29.6265 0.774312C29.6082 0.693572 29.5719 0.618009 29.5203 0.553265C29.4686 0.488522 29.403 0.436271 29.3283 0.400416C29.2537 0.36456 29.1718 0.346025 29.089 0.346196H20.063C19.9286 0.346818 19.7984 0.392943 19.6936 0.47704C19.5889 0.561137 19.5157 0.67824 19.4861 0.809231ZM47.2441 6.81309H48.9989C49.1232 6.8131 49.2438 6.77075 49.3408 6.69302C49.4378 6.61529 49.5054 6.50683 49.5324 6.38554L50.7259 1.01002C50.7433 0.930132 50.7425 0.847381 50.7236 0.767837C50.7048 0.688292 50.6684 0.61397 50.617 0.550317C50.5657 0.486665 50.5008 0.435296 50.427 0.399976C50.3532 0.364657 50.2725 0.346281 50.1907 0.346196H31.7342C31.5981 0.346141 31.466 0.392522 31.3598 0.477665C31.2537 0.562809 31.1798 0.681613 31.1504 0.814423L30.8325 2.25026C30.8024 2.38616 30.8229 2.52837 30.8902 2.65025C30.9575 2.77213 31.0669 2.86532 31.198 2.91236L31.2604 2.93399C31.8667 3.16594 32.7138 3.75361 32.3448 5.1981L28.727 21.5713C28.7093 21.6509 28.7098 21.7334 28.7283 21.8127C28.7468 21.8921 28.783 21.9662 28.834 22.0298C28.885 22.0933 28.9497 22.1446 29.0232 22.1799C29.0967 22.2151 29.1772 22.2334 29.2588 22.2334H37.5607C37.6848 22.2334 37.8052 22.1912 37.902 22.1136C37.9989 22.036 38.0664 21.9278 38.0933 21.8067L38.4545 20.1718C38.4805 20.055 38.4653 19.9328 38.4115 19.8259C38.3577 19.7189 38.2685 19.6339 38.1592 19.585L38.0786 19.5478C37.552 19.2882 36.7682 18.6962 37.0306 17.5503C37.0601 17.3962 37.8482 13.8477 37.8482 13.8477H44.9072C45.0324 13.8475 45.1537 13.8045 45.251 13.7257C45.3482 13.647 45.4155 13.5373 45.4417 13.415L46.106 10.4256C46.1237 10.3454 46.1233 10.2623 46.1046 10.1823C46.0859 10.1023 46.0495 10.0276 45.998 9.96353C45.9466 9.89949 45.8814 9.8478 45.8073 9.81229C45.7332 9.77678 45.652 9.75834 45.5698 9.75834H38.7533L40.0257 3.95959L44.7895 3.95353C46.3286 3.95353 46.798 4.7567 46.7088 6.12677C46.7088 6.12677 46.7088 6.14407 46.701 6.19947C46.6923 6.2762 46.6998 6.35391 46.723 6.42757C46.7462 6.50122 46.7847 6.56918 46.8359 6.62703C46.8871 6.68488 46.9499 6.73134 47.0202 6.76339C47.0905 6.79544 47.1668 6.81238 47.2441 6.81309Z"
            fill="#E4002B"
          />
          <path
            d="M75.9996 3.25177C75.9894 3.71429 75.7983 4.15442 75.4674 4.47792C75.1364 4.80141 74.6918 4.98255 74.2288 4.98255C73.7658 4.98255 73.3213 4.80141 72.9903 4.47792C72.6593 4.15442 72.4682 3.71429 72.458 3.25177C72.4682 2.78925 72.6593 2.34913 72.9903 2.02563C73.3213 1.70214 73.7658 1.521 74.2288 1.521C74.6918 1.521 75.1364 1.70214 75.4674 2.02563C75.7983 2.34913 75.9894 2.78925 75.9996 3.25177ZM75.7398 3.25177C75.7446 3.05069 75.7091 2.85067 75.6355 2.66348C75.5618 2.47629 75.4514 2.30572 75.3108 2.1618C75.1701 2.01787 75.0021 1.9035 74.8166 1.82542C74.6311 1.74733 74.4319 1.70711 74.2306 1.70711C74.0293 1.70711 73.83 1.74733 73.6445 1.82542C73.459 1.9035 73.291 2.01787 73.1503 2.1618C73.0097 2.30572 72.8993 2.47629 72.8256 2.66348C72.752 2.85067 72.7165 3.05069 72.7213 3.25177C72.7165 3.45286 72.752 3.65288 72.8256 3.84007C72.8993 4.02726 73.0097 4.19783 73.1503 4.34175C73.291 4.48568 73.459 4.60005 73.6445 4.67813C73.83 4.75622 74.0293 4.79644 74.2306 4.79644C74.4319 4.79644 74.6311 4.75622 74.8166 4.67813C75.0021 4.60005 75.1701 4.48568 75.3108 4.34175C75.4514 4.19783 75.5618 4.02726 75.6355 3.84007C75.7091 3.65288 75.7446 3.45286 75.7398 3.25177ZM74.7004 4.11034C74.6544 4.05614 74.6244 3.99021 74.6138 3.91993L74.5523 3.64211C74.5004 3.4517 74.4042 3.39977 74.2059 3.39977H73.8447V4.11034H73.5485V2.34129H74.3124C74.7143 2.34129 74.923 2.51438 74.923 2.84413C74.9249 2.95607 74.8839 3.06448 74.8084 3.14718C74.7328 3.22989 74.6285 3.28062 74.5168 3.28899C74.5947 3.29511 74.6682 3.32733 74.7254 3.38043C74.7826 3.43353 74.8202 3.50439 74.8321 3.58152L74.9109 3.90262C74.9262 3.98012 74.9625 4.05195 75.0157 4.11034H74.7004ZM74.2726 2.57497H73.8447V3.16523H74.2726C74.5081 3.16523 74.619 3.0605 74.619 2.86144C74.619 2.66238 74.5081 2.57497 74.2726 2.57497Z"
            fill="#E4002B"
          />
        </svg>
      </Center>
      <div>
        {loading ? (
          <Center>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.400"
              color="blue.500"
              size="2xl"
            />
          </Center>
        ) : (
          " "
        )}
      </div>
      <div>
        {Authinicated ? (
          <div>
            <Heading fontSize={["10px", "10px", "20px", "20px"]}>
              LET’S SIGN IN OR CREATE ACCOUNT WITH YOUR PHONE
            </Heading>
            <Heading fontSize={["12px", "12px", "20px", "20px"]} mb="20px">
              NUMBER!
            </Heading>
          </div>
        ) : (
          <Heading fontSize={["10px", "10px", "20px", "20px"]}>
            WE JUST TEXTED YOU
          </Heading>
        )}
        {Authinicated ? (
          ""
        ) : (
          <Text mt="20px" mb="35px">
            Please enter the verification code we just sent to {Number}
          </Text>
        )}
        <div>
          {Authinicated ? (
            <Input
              colorScheme="black"
              variant="flushed"
              placeholder="Phone Number *"
              color="black"
              mb="20px"
              value={Number}
              onChange={(e) => setNumber(e.target.value)}
            />
          ) : (
            <Center mb="20px">
              <PinInput type="alphanumeric" mask>
                <PinInputField
                  mr="5px"
                  onChange={(e) => setOtp(Otp + e.target.value)}
                />
                <PinInputField
                  mr="5px"
                  onChange={(e) => setOtp(Otp + e.target.value)}
                />
                <PinInputField
                  mr="5px"
                  onChange={(e) => setOtp(Otp + e.target.value)}
                />
                <PinInputField
                  mr="5px"
                  onChange={(e) => setOtp(Otp + e.target.value)}
                />
                <PinInputField
                  mr="5px"
                  onChange={(e) => setOtp(Otp + e.target.value)}
                />
                <PinInputField
                  mr="5px"
                  onChange={(e) => setOtp(Otp + e.target.value)}
                />
              </PinInput>
            </Center>
          )}
        </div>
        <Box id="recaptcha-container" mb="10px" />
        {Authinicated ? (
          <Text fontSize={["8px", "8px", "12px", "14px"]}>
            By “logging in to KFC”, you agree to our Privacy Policy and Terms &
            Conditions.
          </Text>
        ) : (
          <Text>Your code will expire in 0:169sec</Text>
        )}
      </div>
      <div>
        <Text color="red">{error}</Text>
      </div>

      {Authinicated ? (
        <Button
          mt="30px"
          onClick={handleSubmit}
          backgroundColor="black"
          colorScheme="grey"
          fontSize={{ sm: "15px" }}
          color="white"
          borderRadius="30px"
          p="4% 7%"
        >
          Send me a Code
        </Button>
      ) : (
        <Button
          mt="30px"
          backgroundColor="black"
          colorScheme="grey"
          fontSize={{ sm: "15px" }}
          color="white"
          borderRadius="30px"
          disabled={Otp.length === 6 ? false : true}
          onClick={verifyOtp}
        >
          Submit
        </Button>
      )}
    </div>
  );
}

export default Signup;
