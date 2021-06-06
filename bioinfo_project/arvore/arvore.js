// Get JSON data
treeJSON = d3.json("arvore.json", function(error, treeData) {
  // Calcular valor total de nós, tamanho máximo da label
      var totalNodes = 0;
      var maxLabelLength = 0;
      // Variaveis Drag/drop (função desativada)
      var selectedNode = null;
      var draggingNode = null;
      // Variaveis panoramicas
      var panSpeed = 200;
      var panBoundary = 20;
      // Outras variaveis
      var i = 0;
      var duration = 750;
      var root;

      // Dimensionamento do Viewer
      var viewerWidth = $(document).width();
      var viewerHeight = $(document).height();

      var tree = d3.layout.tree()
          .size([viewerHeight, viewerWidth]);

      // Define uma projeção diagonal d3, para uso posterior dos caminhos dos nós.
      var diagonal = d3.svg.diagonal()
          .projection(function(d) {
              return [d.y, d.x];
          });

      //Uma função auxiliar recursiva para realizar algumas configurações ao percorrer todos os nós
      function visit(parent, visitFn, childrenFn) {
          if (!parent) return;

          visitFn(parent);

          var children = childrenFn(parent);
          if (children) {
              var count = children.length;
              for (var i = 0; i < count; i++) {
                  visit(children[i], visitFn, childrenFn);
              }
          }
      }

      visit(treeData, function(d) {
          totalNodes++;
          maxLabelLength = Math.max(d.name.length, maxLabelLength);

      }, function(d) {
          return d.children && d.children.length > 0 ? d.children : null;
      });


      //Classifica a árvore de acordo com os nomes dos nós
      function sortTree() {
          tree.sort(function(a, b) {
              return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
          });
      }
      //Classifica a árvore inicialmente, caso o JSON não esteja em uma ordem de classificação.
      sortTree();

      function pan(domNode, direction) {
          var speed = panSpeed;
          if (panTimer) {
              clearTimeout(panTimer);
              translateCoords = d3.transform(svgGroup.attr("transform"));
              if (direction == 'left' || direction == 'right') {
                  translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                  translateY = translateCoords.translate[1];
              } else if (direction == 'up' || direction == 'down') {
                  translateX = translateCoords.translate[0];
                  translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
              }
              scaleX = translateCoords.scale[0];
              scaleY = translateCoords.scale[1];
              scale = zoomListener.scale();
              svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
              d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
              zoomListener.scale(zoomListener.scale());
              zoomListener.translate([translateX, translateY]);
              panTimer = setTimeout(function() {
                  pan(domNode, speed, direction);
              }, 50);
          }
      }

      //Define o zoom do Viewer
      function zoom() {
          svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }

      var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

      function initiateDrag(d, domNode) {
          draggingNode = d;
          d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
          d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
          d3.select(domNode).attr('class', 'node activeDrag');

          svgGroup.selectAll("g.node").sort(function(a, b) {
              if (a.id != draggingNode.id) return 1;
              else return -1;
          });
          // Se o nó tiver ramos, remover links e nós
          if (nodes.length > 1) {
              // Remover caminhos (links)
              links = tree.links(nodes);
              nodePaths = svgGroup.selectAll("path.link")
                  .data(links, function(d) {
                      return d.target.id;
                  }).remove();
              // Remover nós (children)
              nodesExit = svgGroup.selectAll("g.node")
                  .data(nodes, function(d) {
                      return d.id;
                  }).filter(function(d, i) {
                      if (d.id == draggingNode.id) {
                          return false;
                      }
                      return true;
                  }).remove();
          }

          // Remover nós (pais)
          parentLink = tree.links(tree.nodes(draggingNode.parent));
          svgGroup.selectAll('path.link').filter(function(d, i) {
              if (d.target.id == draggingNode.id) {
                  return true;
              }
              return false;
          }).remove();

          dragStarted = null;
      }

      var baseSvg = d3.select("#tree-container").append("svg")
          .attr("width", viewerWidth)
          .attr("height", viewerHeight)
          .attr("class", "overlay")
          .call(zoomListener);


      // Define o ponto de espera para o comportamento drag/drop dos nós
      dragListener = d3.behavior.drag()
          .on("dragstart", function(d) {
              if (d == root) {
                  return;
              }
              dragStarted = false; //Quando "true", função permite a movimentação de um nó para qualquer "primo", a partir do clique do mouse.
              nodes = tree.nodes(d);
              //d3.event.sourceEvent.stopPropagation(); //Comentada. Permite movimentação do nó para qualquer ponto do Viewer.

          })
          .on("drag", function(d) {
              if (d == root) {
                  return;
              }
              if (dragStarted) {
                  domNode = this;
                  initiateDrag(d, domNode);
              }

              //Obter as coordnadas do mouseEvent, em relação ao recipiente svg, para permitir a panorâmica
              relCoords = d3.mouse($('svg').get(0));
              if (relCoords[0] < panBoundary) {
                  panTimer = true;
                  pan(this, 'left');
              } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

                  panTimer = true;
                  pan(this, 'right');
              } else if (relCoords[1] < panBoundary) {
                  panTimer = true;
                  pan(this, 'up');
              } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
                  panTimer = true;
                  pan(this, 'down');
              } else {
                  try {
                      clearTimeout(panTimer);
                  } catch (e) {

                  }
              }

              d.x0 += d3.event.dy;
              d.y0 += d3.event.dx;
              var node = d3.select(this);
              node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
              updateTempConnector();
          }).on("dragend", function(d) {
              if (d == root) {
                  return;
              }
              domNode = this;
              if (selectedNode) {

                  var index = draggingNode.parent.children.indexOf(draggingNode);
                  if (index > -1) {
                      draggingNode.parent.children.splice(index, 1);
                  }
                  if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                      if (typeof selectedNode.children !== 'undefined') {
                          selectedNode.children.push(draggingNode);
                      } else {
                          selectedNode._children.push(draggingNode);
                      }
                  } else {
                      selectedNode.children = [];
                      selectedNode.children.push(draggingNode);
                  }

                  expand(selectedNode);
                  sortTree();
                  endDrag();
              } else {
                  endDrag();
              }
          });

      function endDrag() {
          selectedNode = null;
          d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
          d3.select(domNode).attr('class', 'node');

          d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
          updateTempConnector();
          if (draggingNode !== null) {
              update(root);
              centerNode(draggingNode);
              draggingNode = null;
          }
      }

      // Helper functions for collapsing and expanding nodes.

      function collapse(d) {
          if (d.children) {
              d._children = d.children;
              d._children.forEach(collapse);
              d.children = null;
          }
      }

      function expand(d) {
          if (d._children) {
              d.children = d._children;
              d.children.forEach(expand);
              d._children = null;
          }
      }

      var overCircle = function(d) {
          selectedNode = d;
          updateTempConnector();
      };
      var outCircle = function(d) {
          selectedNode = null;
          updateTempConnector();
      };

      //Função para atualizar o conector temporário indicando afiliação ao arrastar.
      var updateTempConnector = function() {
          var data = [];
          if (draggingNode !== null && selectedNode !== null) {
              //Deve-se inverter as coordenadas da fonte já que fizemos isso para os conectores existentes na árvore original
              data = [{
                  source: {
                      x: selectedNode.y0,
                      y: selectedNode.x0
                  },
                  target: {
                      x: draggingNode.y0,
                      y: draggingNode.x0
                  }
              }];
          }
          var link = svgGroup.selectAll(".templink").data(data);

          link.enter().append("path")
              .attr("class", "templink")
              .attr("d", d3.svg.diagonal())
              .attr('pointer-events', 'none');

          link.attr("d", d3.svg.diagonal());

          link.exit().remove();
      };

      //Função para centralizar o nó ao clicar/soltar, para que o nó não se perca ao recolher/mover com uma grande quantidade de filhos.

      function centerNode(source) {
          scale = zoomListener.scale();
          x = -source.y0;
          y = -source.x0;
          x = x * scale + viewerWidth / 2;
          y = y * scale + viewerHeight / 2;
          d3.select('g').transition()
              .duration(duration)
              .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
          zoomListener.scale(scale);
          zoomListener.translate([x, y]);
      }

      //Alterna a função dos filhos
      function toggleChildren(d) {
          if (d.children) {
              d._children = d.children;
              d.children = null;
          } else if (d._children) {
              d.children = d._children;
              d._children = null;
          }
          return d;
      }

      //Alterna os filhos ao clicar.
      function click(d) {
          if (d3.event.defaultPrevented) return; //clique suprimido
          d = toggleChildren(d);
          update(d);
          centerNode(d);
      }

      function update(source) {

          // Calcula a nova altura, a função conta o total de filhos do nó raiz e define a altura da árvore de acordo.
          var levelWidth = [1];
          var childCount = function(level, n) {

              if (n.children && n.children.length > 0) {
                  if (levelWidth.length <= level + 1) levelWidth.push(0);

                  levelWidth[level + 1] += n.children.length;
                  n.children.forEach(function(d) {
                      childCount(level + 1, d);
                  });
              }
          };
          childCount(0, root);
          var newHeight = d3.max(levelWidth) * 25; // 25 pixels por linha
          tree = tree.size([newHeight, viewerWidth]);

          //Calcula o novo layout da árvore
          var nodes = tree.nodes(root).reverse(),
              links = tree.links(nodes);

          //Define a distância horizontal entre os nós,
          nodes.forEach(function(d) {
              d.y = (d.depth * (maxLabelLength * 15)); //maxLabelLength * 10px
              d.x = d.x * 2.15; //Define a distância vertical entre os nós, evitando assim a sobreposição de nomes
          });

          node = svgGroup.selectAll("g.node")
              .data(nodes, function(d) {
                  return d.id || (d.id = ++i);
              });

          var nodeEnter = node.enter().append("g")
              .call(dragListener)
              .attr("class", "node")
              .attr("transform", function(d) {
                  return "translate(" + source.y0 + "," + source.x0 + ")";
              })
              .on('click', click);

          nodeEnter.append("circle")
              .attr('class', 'nodeCircle')
              .attr("r", 0)
              .style("fill", function(d) {
                  return d._children ? "lightsteelblue" : "#fff";
              });

          nodeEnter.append("text")
              .attr("x", function(d) {
                  return d.children || d._children ? -10 : 10;
              })
              .attr("dy", ".35em")
              .attr('class', 'nodeText')
              .attr("text-anchor", function(d) {
                  return d.children || d._children ? "end" : "start";
              })
              .text(function(d) {
                  return d.name;
              })
              .style("fill-opacity", 0);

          //Função nó-fantasma: insere um circulo vermelho ao dar mouseover, em um raio, ao redor dele
          nodeEnter.append("circle")
              .attr('class', 'ghostCircle')
              .attr("r", 30)
              .attr("opacity", 0.2) //se preferir ocultar área, modificar valor para 0.
          .style("fill", "red")
              .attr('pointer-events', 'mouseover')
              .on("mouseover", function(node) {
                  overCircle(node);
              })
              .on("mouseout", function(node) {
                  outCircle(node);
              });

          //Atualiza o texto para refletir/exibir se o nó tem filhos ou não.
          node.select('text')
              .attr("x", function(d) {
                  return d.children || d._children ? -10 : 10;
              })
              .attr("text-anchor", function(d) {
                  return d.children || d._children ? "end" : "start";
              })
              .text(function(d) {
                  return d.name;
              });

          //Altera o preenchimento do círculo dependendo se ele tem filhos e está recolhido
          node.select("circle.nodeCircle")
              .attr("r", 4.5)
              .style("fill", function(d) {
                  return d._children ? "lightsteelblue" : "#fff";
              });

          // Transição dos nós para sua nova posição (ao recolher ou arrastar)
          var nodeUpdate = node.transition()
              .duration(duration)
              .attr("transform", function(d) {
                  return "translate(" + d.y + "," + d.x + ")";
              });

          nodeUpdate.select("text")
              .style("fill-opacity", 1);

          //Transição dos nós de saída para a nova posição do pai (ao recolher ou arrastar).
          var nodeExit = node.exit().transition()
              .duration(duration)
              .attr("transform", function(d) {
                  return "translate(" + source.y + "," + source.x + ")";
              })
              .remove();

          nodeExit.select("circle")
              .attr("r", 0);

          nodeExit.select("text")
              .style("fill-opacity", 0);

          // Atualização dos links
          var link = svgGroup.selectAll("path.link")
              .data(links, function(d) {
                  return d.target.id;
              });

          link.enter().insert("path", "g")
              .attr("class", "link")
              .attr("d", function(d) {
                  var o = {
                      x: source.x0,
                      y: source.y0
                  };
                  return diagonal({
                      source: o,
                      target: o
                  });
              });

          //Transição dos links para a nova posição
          link.transition()
              .duration(duration)
              .attr("d", diagonal);

          //Transição dos nós de saída para a nova posição do pai.
          link.exit().transition()
              .duration(duration)
              .attr("d", function(d) {
                  var o = {
                      x: source.x,
                      y: source.y
                  };
                  return diagonal({
                      source: o,
                      target: o
                  });
              })
              .remove();

          //Guarda as posições antigas para a transição.
          nodes.forEach(function(d) {
              d.x0 = d.x;
              d.y0 = d.y;
          });
      }

      //Acrescenta um grupo que contém todos os nós e sobre o qual o ouvinte de zoom pode atuar.
      var svgGroup = baseSvg.append("g");

      //Define a raiz (origem)
      root = treeData;
      root.x0 = viewerHeight / 2;
      root.y0 = 0;

      //Faça o layout da árvore inicialmente e centralize no nó raiz.
      update(root); //Ponto de origem é carregado no ponto central da página
      centerNode(root);
  });