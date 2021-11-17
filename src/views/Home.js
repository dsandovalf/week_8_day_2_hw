import React, { Component } from 'react'
import * as Yup from 'yup';
import {Formik, Field, Form} from 'formik';
import Table from 'react-bootstrap/Table'

const formSchema = Yup.object().shape({
    "pokeName": Yup.string()
                .required("Required")
})

const initialValues = {
    pokeName: ''
}

export default class Home extends Component {

    constructor() {
        super();
        this.state={
            pokemons:[],
            badRound:false
        };
    }

    handleSubmit=({pokeName})=>{
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName.toLowerCase()}`)
            .then(res=>res.json())
            .then(data=>{
                this.setState({
                    pokemons: [data],
                    badRound: false
                }, ()=>console.log(this.state.pokemons))
            })
            .catch(error=>{console.error(error); this.setState({badRound:true})})
    }    

    render() {
        return (
            <div>
                <h1>Search Pokemon</h1>
                {this.state.badRound ? <small style={{color:"red"}}>Invalid Pokemon Name</small>:""}
                <Formik initialValues={initialValues}
                        validationSchema={formSchema}
                        onSubmit={
                            (values, {resetForm})=>{
                                this.handleSubmit(values);
                                resetForm(initialValues);
                            }
                        }
                        >
                        {
                            ({errors, touched})=>(
                                <Form>
                                    <label htmlFor="pokeName" className="form-label">Pokemon name:</label>
                                    <Field name="pokeName" className="form-control" />
                                    {errors.pokeName && touched.pokeName ? (<div style={{color:'red'}}>{errors.pokeName}</div>):null}
                                    
                                    <button type="submit" className="btn btn-primary">Search</button>

                                </Form>
                            )
                        }

                </Formik>

                {/* racer table starts here */}
                {this.state.pokemons?.length > 0  ?
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Name</th>
                            <th>Ability</th>
                            <th>Sprite</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.pokemons.map(
                                pokemon => (
                                    <tr key={pokemon.name}>
                                        <td>{pokemon.name}</td>
                                        <td>{pokemon.abilities[0].ability.name}</td>
                                        <td><img src={pokemon.sprites.front_shiny} height="100" alt="pokemon"/></td>
                                    </tr>
                                )
                            )
                            
                            }
                        </tbody>
                    </Table>
                :''}

            </div>
        )
    }
}