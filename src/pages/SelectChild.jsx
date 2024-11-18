import React, { useEffect, useState } from "react";
import styled from "styled-components";
import defaultImage from "../assets/image/defaultImage.svg";
import addImage from "../assets/image/addImage.svg";
import { useNavigate } from "react-router-dom";
import ParentChildRelationshipABI from "../abi/ParentChildRelationshipWithMeta.json";
import { ethers } from "ethers";

const SelectChild = () => {
  const [children, setChildren] = useState([]);
  const navigate = useNavigate();

  const getChildInformation = async () => {
    if (!window.ethereum) {
      throw new Error("METAMask not install");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    // MetaMask 계정 연결 요청
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      process.env.REACT_APP_PARENT_CHILD_RELATIONSHIP_ADDRESS,
      ParentChildRelationshipABI.abi,
      signer // provider 대신 signer 사용
    );

    const children = await contract.returnChildInformation();

    return children;
  };

  useEffect(() => {
    const fetchChildrenData = async () => {
      try {
        const childData = await getChildInformation();
        setChildren(Array.isArray(childData) ? childData : []);
        console.log(childData);
      } catch (error) {
        console.error("Failed to fetch children data:", error);
      }
    };

    fetchChildrenData();
  }, []);

  return (
    <Container>
      <TopBar>
        <TopBarTitle>PAWPAW</TopBarTitle>
        <TopBarButton
          onClick={() => {
            navigate("/synchronization");
          }}
        >
          동기화 하기
        </TopBarButton>
      </TopBar>
      <SelectContainer>
        <Title>아이의 프로필을 선택해주세요</Title>
        <GridContainer>
          {children.map((child, index) => (
            // 누르게 되면 자식의 대시보드로 넘어가도록 개발이 되어야 함.
            // 자식들의 주소를 활용하여 대시보드에 접근
            // 만약 다른 부모들이 자식의 데이터에 접근을 하지 못하도록 함.
            <ProfileBox
              key={index}
              onClick={() => {
                console.log("/dashboard");
              }}
            >
              <ProfileImage src={child.imgUrl || defaultImage} alt="profile" />
              <ProfileName>{child.name}</ProfileName>
            </ProfileBox>
          ))}
          <ProfileBox
            onClick={() => {
              navigate("/add");
            }}
          >
            <ProfileImage src={addImage} alt="add profile" />
            <ProfileName>추가</ProfileName>
          </ProfileBox>
        </GridContainer>
      </SelectContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffcc80;
`;

const TopBar = styled.div`
  width: 100%;
  padding: 20px;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TopBarTitle = styled.span`
  font-family: KOTRAHOPE;
  font-size: 32px;
  font-weight: 400;
  line-height: 37.28px;
  text-align: left;
  color: #4f2304;
`;

const TopBarButton = styled.button`
  font-family: KOTRAHOPE;
  font-size: 25px;
  font-weight: 400;
  line-height: 37.28px;
  text-align: left;
  color: #4f2304;
  background: none;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
`;

const Title = styled.span`
  font-family: Karla;
  font-size: 20px;
  font-weight: 800;
  line-height: 23.38px;
  text-align: left;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 300px; /* Adjust based on design */
`;

const ProfileBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ProfileImage = styled.img`
  width: 126px;
  height: 126px;
  border-radius: 8px;
  background-color: #f0f0f0;
`;

const ProfileName = styled.span`
  margin-top: 8px;
  font-family: Karla;
  font-size: 20px;
  font-weight: 700;
  line-height: 23.38px;
  text-align: left;
`;

export default SelectChild;
