import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import useFetchData from '../shared/hooks/fetchData-hook';
import usePostData from '../shared/hooks/postData-hook';
import useDeleteData from '../shared/hooks/deleteData-hook';

import Input from '../shared/FormElements/Input';
import FormModal from '../shared/UIElements/FormModal/FormModal';
import Button from '../shared/FormElements/Button';
import HouseCard from './HouseCard';
import styles from './Houses.module.css';
import { useSelector } from 'react-redux';

const Houses = () => {
  const { token, userId } = useSelector((state) => ({ ...state.auth }));
  const [houseCreation, setHouseCreation] = useState(false);
  const loadedData = useFetchData(
    `${process.env.REACT_APP_BACKEND_URL}/house/user/${userId}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  const { post } = usePostData();
  const { deleteData } = useDeleteData();

  const deleteHouseHandler = (id) => {
    const deleteFilter = () => {
      loadedData.setData((prevData) =>
        prevData.filter((element) => element._id !== id)
      );
    };
    deleteData(
      `${process.env.REACT_APP_BACKEND_URL}/house/`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      id,
      deleteFilter
    );
  };

  let houses;

  if (loadedData.dataLoaded) {
    if (loadedData.data.length > 0) {
      houses = loadedData.data.map((house) => {
        return (
          <HouseCard
            houseName={house.houseName}
            key={house._id}
            houseId={house._id}
            deleteHouse={deleteHouseHandler}
          />
        );
      });
    } else {
      houses = <h2>There are no houses. Would you like to create one?</h2>;
    }
  }

  const createHouseHandler = (houseName, password) => {
    const addFilter = (res) => {
      if (loadedData.data) {
        loadedData.setData((prevData) => [...prevData, res]);
      } else {
        loadedData.setData([res]);
      }
    };

    const createdHouse = {
      houseName,
      password,
    };
    post(
      `${process.env.REACT_APP_BACKEND_URL}/house/`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      createdHouse,
      addFilter
    );
    setHouseCreation(false);
  };

  const form = (
    <Formik
      initialValues={{
        houseName: '',
        password: '',
      }}
      onSubmit={async (values) => {
        // console.log(values);
        createHouseHandler(values.houseName, values.password);
      }}
    >
      {() => (
        <Form className={styles.form}>
          <Input
            id="houseName"
            name="houseName"
            type="input"
            title="NAME OF THE HOUSE"
          />
          <Input
            id="password"
            name="password"
            type="password"
            title="EMAIL-PASSWORD"
          />
          <div className={styles.buttonsDiv}>
            <Button
              type="button"
              onClick={() => setHouseCreation(false)}
              cancel
              className={styles.button}
            >
              CANCEL
            </Button>
            <Button type="submit" className={styles.button}>
              CREATE!
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );

  return (
    <div className={styles.housesDiv}>
      <FormModal
        onCancel={() => setHouseCreation(false)}
        header="CREATE HOUSE?"
        show={houseCreation}
        form={form}
      />
      {houses}

      <Button
        onClick={() => setHouseCreation(true)}
        className={styles.createHouseBtn}
        danger
      >
        CREATE HOUSE
      </Button>
    </div>
  );
};

export default Houses;
