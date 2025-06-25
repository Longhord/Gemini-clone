import React, { useContext } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'


const Main = () => {

    const {onSent,showResult,loading,chatHistory,setInput,input} = useContext(Context);
    return(
        <div className='main'>
            <div className='nav'>
                <p>Scorpio</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className='main-container'>
                {!showResult
                ?<>
                    <div className='greet'>
                        <p><span>Hello, Dev</span></p>
                        <p>How can I help you today</p>
                    </div>
                    <div className="cards">
                        <div className="card">
                            <p>Suggest beautiful places to see on an upcoming road trip</p>
                            <img src={assets.compass_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>Briefly summarize this concept: urban planning</p>
                            <img src={assets.bulb_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>Brainstorm team bonding activities for our work retreat</p>
                            <img src={assets.message_icon} alt="" />
                        </div>
                        <div className="card">
                            <p>Improve the readability of the following code</p>
                            <img src={assets.code_icon} alt="" />
                        </div>
                    </div>
                </>
                :<div className='result'>
                    <div className='chat-history'>
                        {chatHistory.map((item, idx) => (
                            <div key={idx} className={`chat-bubble ${item.role === 'user' ? 'user' : 'ai'}`}> 
                                <img 
                                    src={item.role === 'user' ? assets.user_icon : assets.gemini_icon} 
                                    alt={item.role} 
                                    className='chat-icon'
                                />
                                <p dangerouslySetInnerHTML={{__html: item.message.replace(/\n/g, '<br/>')}}></p>
                            </div>
                        ))}
                        {loading && (
                            <div className='chat-bubble ai'>
                                <img src={assets.gemini_icon} alt="ai" className='chat-icon' />
                                <div className='loader'>
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                }

                <div className="main-bottom">
                    <div className="search-box">
                        <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' 
                            onKeyDown={(e) => { if (e.key === 'Enter') onSent(input); }}
                        />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            <img onClick={()=>onSent(input)} src={assets.send_icon} alt="" />
                        </div>
                    </div>
                    <p className='bottom-info'>
                    Scorpio may display inaccurate info, including about people, so double-check its response.
                </p>
                </div>
            </div>
        </div>
    )
}

export default Main