import React, {useState, forwardRef, useRef, useEffect} from 'react';
import { FloatingLabel, Form, Button, Card, ListGroup, CloseButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Input = forwardRef(({ name, feedback, ...props }, ref) => (
  <FloatingLabel
    controlId="schemaInput"
    label={name}
    className="mb-3"

  >
    <Form.Control
      ref={ref}
      {...props}
      placeholder="name@example.com" />
    <Form.Control.Feedback  className="text-left" type="invalid">
      {feedback}
    </Form.Control.Feedback>
  </FloatingLabel>
))

const LinkCard =({link,onDelete, index}) => {
  return (
    <ListGroup.Item className='d-flex justify-content-between'>
      <a href={link}>{link}</a>
      <CloseButton onClick={()=>onDelete(index)}/>
    </ListGroup.Item>
  )
};


const MainFeature = () => {
  const [validated, setValidated] = useState(false);
  const [listItem, setListItem] = useState([]);
  const schemaRef = useRef()
  const linkRef = useRef()
  const routeRef =useRef()

  const onElementChangeHandle =(e) => {
    linkRef.current.value = `${schemaRef.current.value}://${routeRef.current.value}`
  };
  useEffect(() => {
    const data= localStorage.getItem('listItem')
    if (data) {
      setListItem(JSON.parse(data))
      schemaRef.current.value =  localStorage.getItem('schema')
    }

  }, []);
  useEffect(() => {
    localStorage.setItem('listItem', JSON.stringify(listItem))
    localStorage.setItem('schema',schemaRef.current.value)
  }, [listItem]);
  
  const handleSubmit = (event) => {
    setValidated(true);
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) return
    setListItem([...listItem,linkRef.current.value])
    linkRef.current.value=''
    routeRef.current.value=''
    setValidated(false)
  };
  const onDeleteHandle = (index) => {
    listItem.splice (index, 1);
    setListItem([...listItem])
  };
  

  
  return (
    <>
    <div className="container">

      <Form  noValidate validated={validated} onSubmit={handleSubmit}>
        <h1 className="text-center">
          CREATE DEEP LINK APP
        </h1>

        <div className='row'>
          <div className="col-12 col-sm-6">
            <Input ref={schemaRef} name='Schema' onChange={onElementChangeHandle}/>
          </div>
          <div className="col-12 col-sm-6">
              <Input ref={routeRef} name='Route' onChange={onElementChangeHandle} />
            </div>
          </div>
          <div className="row">
            <h2> =&gt; Generate link</h2>
            <div className='col'>
              <Input ref={linkRef} required name='Link' feedback='This field is required' />
            </div>
          </div>
          <div  className="row justify-content-center">
            <Button className='w-25' style={{minWidth:150}} type="submit">Submit Link</Button>
          </div>
        </Form>
        <Card className="mt-3" >
          <Card.Header>LINK RENDERED</Card.Header>
          <ListGroup variant="flush">
            {listItem.map((item,index) => <LinkCard key={index} link={item} index={index} onDelete={onDeleteHandle}/>
            )}
        </ListGroup>
      </Card>
    </div>

    </>
  )
};
export default MainFeature;
