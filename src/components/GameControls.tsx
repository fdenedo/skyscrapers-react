import React from "react";

interface GameControlsProps {

}

const GameControls: React.FC<GameControlsProps> = ({

}) => {
    return (
        <div className="control-panel">
            <div className="control-panel_header">
                <div className="timer"></div>
                <div className="play-pause-btn"></div>
            </div>
            <div className="control-panel_body">
                <div className="number-input-btns">
                    <div className="pencil-pen-btns">
                        <div className="pencil-pen-btns pen-btn"></div>
                        <div className="pencil-pen-btns pencil-btn"></div>
                    </div>
                    <div className="number-input-btn input-1" data-input={1}>1</div>
                    <div className="number-input-btn input-2" data-input={2}>2</div>
                    <div className="number-input-btn input-3" data-input={3}>3</div>
                    <div className="number-input-btn input-4" data-input={4}>4</div>
                    <div className="number-input-btn input-5" data-input={5}>5</div>
                </div>
                <div className="game-controls">
                    <div className="control-btn undo-btn"></div>
                    <div className="control-btn redo-btn"></div>
                    <div className="control-btn select-all-btn"></div>
                    <div className="control-btn select-unfilled-btn"></div>
                </div>
            </div>
        </div>
    )
}

export default GameControls;