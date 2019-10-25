/*
** Main Function
*/
function BranchNBound(JSONMatrix) {
    var NUM_NODES = NODES.length;
    var i = 0;
    var html = '';
    while (NUM_NODES > 0) {

        JSONMatrix = rowMinimization(JSONMatrix);
        console.log('rowMinimization');
        console.log(JSONMatrix);
        i++; html += '<h4>Step ' + i + '</h4>';
        html += '<p>Row Minimization</p>';
        html += _createMatrix(JSONMatrix);

        JSONMatrix = columnMinimization(JSONMatrix);
        console.log('columnMinimization');
        console.log(JSONMatrix);
        i++; html += '<h4>Step ' + i + '</h4>';
        html += '<p>Column Minimization</p>';
        html += _createMatrix(JSONMatrix);

        JSONMatrix = penaltyCheck(JSONMatrix);
        console.log('penaltyCheck');
        console.log(JSONMatrix);
        i++; html += '<h4>Step ' + i + '</h4>';
        html += '<p>Penalty Check & Metrix Deduction</p>';
        html += _createMatrix(JSONMatrix, this.TYPE.PENALTYCHECK);

        NUM_NODES--;
    }

    return html;
}

function _createMatrix(JSONMatrix, TYPE) {
    var matrix = '<table class="table table-striped table-dark">';
    matrix += '<thead>';
    matrix += '<tr>';
    matrix += '<th scope="col">#</th>';
    NODES.forEach(function (colNode) {
        if (!JSONMatrix[NODES[0]][colNode].isDeleted || TYPE == this.TYPE.PENALTYCHECK) {
            matrix += '<th scope="col" ' + (JSONMatrix[NODES[0]][colNode].isDeleted ? 'style="background: #b21c28;"' : '') + '>' + colNode + '</th>';
        }
    }, this);
    matrix += '</tr>';
    matrix += '</thead>';
    matrix += '<tbody>';

    NODES.forEach(function (rowNode) {
        var isRowDel = true; var td = '';
        NODES.forEach(function (colNode) {
            if (!JSONMatrix[rowNode][colNode].isDeleted || TYPE == this.TYPE.PENALTYCHECK) {
                td += '<td ' + (JSONMatrix[rowNode][colNode].isDeleted ? 'style="background: #b21c28;"' : '') + '>' + JSONMatrix[rowNode][colNode].Weight + '</td>';
                if(!JSONMatrix[rowNode][colNode].isDeleted){
                    isRowDel = false;
                }
                
            }
        }, this);

        if (!isRowDel || TYPE == this.TYPE.PENALTYCHECK) {
            matrix += '<tr>';
            matrix += '<th scope="row" ' + (isRowDel ? 'style="background: #b21c28;"' : '') + '>' + rowNode + '</th>';
            matrix += td;
            matrix += '</th>';
            matrix += '</tr>';
        }

    }, this);
    matrix += '</tbody>';
    matrix += '</table>';
    return matrix;
}

/*
** END
*/


/*
** Row Deduction
*/
function rowMinimization(JSONMatrix) {
    NODES.forEach(function (node) {
        JSONMatrix[node] = minimizedRow(JSONMatrix[node]);
    }, this);
    return JSONMatrix;
}

function minimizedRow(row) {
    var min = minRowValue(row);
    NODES.forEach(function (node) {
        if (!row[node].isDeleted) {
            if (row[node].Weight != INFINITY) {
                row[node].Weight = row[node].Weight - min;
            }
        }
    }, this);
    return row;
}

function minRowValue(row, exceptNode) {
    var min = ((row[NODES[0]].Weight == INFINITY) && ((NODES[0] != exceptNode && exceptNode !== undefined) || exceptNode === undefined) ? 9999 : row[NODES[0]].Weight);
    NODES.forEach(function (node) {
        if (!row[node].isDeleted) {
            if ((node != exceptNode && exceptNode !== undefined) || exceptNode === undefined) {
                if (row[node].Weight != INFINITY) {
                    if (row[node].Weight < min) {
                        min = row[node].Weight;
                    }
                }
            }
        }
    }, this);
    return min;
}
/*
** END
*/

/*
** Column Deduction
*/
function columnMinimization(JSONMatrix) {
    for (var i = 0; i < NODES.length; i++) {
        var min = minColumnValue(JSONMatrix, NODES[i]);
        NODES.forEach(function (node) {
            if (!JSONMatrix[node][NODES[i]].isDeleted) {
                if (JSONMatrix[node][NODES[i]].Weight != INFINITY) {
                    JSONMatrix[node][NODES[i]].Weight = JSONMatrix[node][NODES[i]].Weight - min;
                }
            }
        }, this);
    }
    return JSONMatrix;
}

function minColumnValue(JSONMatrix, columnNode, exceptNode) {
    var min = ((JSONMatrix[NODES[0]][columnNode].Weight == INFINITY) && ((NODES[0] != exceptNode && exceptNode !== undefined) || exceptNode === undefined) ? 9999 : JSONMatrix[NODES[0]][columnNode].Weight);
    NODES.forEach(function (node) {
        if (!JSONMatrix[node][columnNode].isDeleted) {
            if ((node != exceptNode && exceptNode !== undefined) || exceptNode === undefined) {
                if (JSONMatrix[node][columnNode].Weight != INFINITY) {
                    if (JSONMatrix[node][columnNode].Weight < min) {
                        min = JSONMatrix[node][columnNode].Weight;
                    }
                }
            }
        }
    }, this);
    return min;
}
/*
** END
*/

/*
** Penalty Check & Metrix Reduction
*/
function penaltyCheck(JSONMatrix) {
    var Maxpenalty = -1;
    var ProwNode = '';
    var PcolNode = '';
    NODES.forEach(function (rowNode) {
        NODES.forEach(function (columnNode) {
            if (!JSONMatrix[rowNode][columnNode].isDeleted) {
                if (JSONMatrix[rowNode][columnNode].Weight == 0) {
                    var minRow = minRowValue(JSONMatrix[rowNode], columnNode);
                    var minColumn = minColumnValue(JSONMatrix, columnNode, rowNode);
                    if ((minColumn + minRow) > Maxpenalty) {
                        ProwNode = rowNode;
                        PcolNode = columnNode;
                        Maxpenalty = (minColumn + minRow);
                    }
                }
            }
        }, this);
    }, this);

    NODES.forEach(function (rowNode) {
        NODES.forEach(function (columnNode) {
            if (rowNode == ProwNode || columnNode == PcolNode) {
                JSONMatrix[rowNode][columnNode].isDeleted = true;
            }
        }, this);
    }, this);

    if (ProwNode && PcolNode) {
        JSONMatrix[PcolNode][ProwNode].Weight = INFINITY;
    }

    console.log('PATH');
    console.log(ProwNode + ' > ' + PcolNode);

    PATH.push(JSON.parse('{"from": "' + ProwNode + '", "to": "' + PcolNode + '"}'));

    return JSONMatrix;
}
/*
** END
*/