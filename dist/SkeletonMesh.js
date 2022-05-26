/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated January 1, 2020. Replaces all prior versions.
 *
 * Copyright (c) 2013-2020, Esoteric Software LLC
 *
 * Integration of the Spine Runtimes into software or otherwise creating
 * derivative works of the Spine Runtimes is permitted under the terms and
 * conditions of Section 2 of the Spine Editor License Agreement:
 * http://esotericsoftware.com/spine-editor-license
 *
 * Otherwise, it is permitted to integrate the Spine Runtimes into software
 * or otherwise create derivative works of the Spine Runtimes (collectively,
 * "Products"), provided that each user of the Products must obtain their own
 * Spine Editor license and redistribution of the Products in any form must
 * include this license and copyright notice.
 *
 * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
 * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/
import { AnimationState, AnimationStateData, ClippingAttachment, Color, MeshAttachment, RegionAttachment, Skeleton, SkeletonClipping, Utils, Vector2 } from "@esotericsoftware/spine-core";
import { MeshBatcher } from "./MeshBatcher";
import * as THREE from "three";
export class SkeletonMeshMaterial extends THREE.ShaderMaterial {
    constructor(customizer) {
        let vertexShader = `
			attribute vec4 color;
			varying vec2 vUv;
			varying vec4 vColor;
			void main() {
				vUv = uv;
				vColor = color;
				gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
			}
		`;
        let fragmentShader = `
			uniform sampler2D map;
			#ifdef USE_SPINE_ALPHATEST
			uniform float alphaTest;
			#endif
			varying vec2 vUv;
			varying vec4 vColor;
			void main(void) {
				gl_FragColor = texture2D(map, vUv)*vColor;
				#ifdef USE_SPINE_ALPHATEST
				if (gl_FragColor.a < alphaTest) discard;
				#endif
			}
		`;
        let parameters = {
            uniforms: {
                map: { value: null },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
            alphaTest: 0.0
        };
        customizer(parameters);
        if (parameters.alphaTest > 0) {
            parameters.defines = { "USE_SPINE_ALPHATEST": 1 };
            parameters.uniforms["alphaTest"] = { value: parameters.alphaTest };
        }
        super(parameters);
    }
    ;
}
export class SkeletonMesh extends THREE.Object3D {
    constructor(skeletonData, materialCustomerizer = (material) => { }) {
        super();
        this.materialCustomerizer = materialCustomerizer;
        this.tempPos = new Vector2();
        this.tempUv = new Vector2();
        this.tempLight = new Color();
        this.tempDark = new Color();
        this.zOffset = 0.1;
        this.batches = new Array();
        this.nextBatchIndex = 0;
        this.clipper = new SkeletonClipping();
        this.vertices = Utils.newFloatArray(1024);
        this.tempColor = new Color();
        this.skeleton = new Skeleton(skeletonData);
        let animData = new AnimationStateData(skeletonData);
        this.state = new AnimationState(animData);
    }
    update(deltaTime) {
        let state = this.state;
        let skeleton = this.skeleton;
        state.update(deltaTime);
        state.apply(skeleton);
        skeleton.updateWorldTransform();
        this.updateGeometry();
    }
    dispose() {
        for (var i = 0; i < this.batches.length; i++) {
            this.batches[i].dispose();
        }
    }
    clearBatches() {
        for (var i = 0; i < this.batches.length; i++) {
            this.batches[i].clear();
            this.batches[i].visible = false;
        }
        this.nextBatchIndex = 0;
    }
    nextBatch() {
        if (this.batches.length == this.nextBatchIndex) {
            let batch = new MeshBatcher(10920, this.materialCustomerizer);
            this.add(batch);
            this.batches.push(batch);
        }
        let batch = this.batches[this.nextBatchIndex++];
        batch.visible = true;
        return batch;
    }
    updateGeometry() {
        this.clearBatches();
        let tempPos = this.tempPos;
        let tempUv = this.tempUv;
        let tempLight = this.tempLight;
        let tempDark = this.tempDark;
        var numVertices = 0;
        var verticesLength = 0;
        var indicesLength = 0;
        let blendMode = null;
        let clipper = this.clipper;
        let vertices = this.vertices;
        let triangles = null;
        let uvs = null;
        let drawOrder = this.skeleton.drawOrder;
        let batch = this.nextBatch();
        batch.begin();
        let z = 0;
        let zOffset = this.zOffset;
        for (let i = 0, n = drawOrder.length; i < n; i++) {
            let vertexSize = clipper.isClipping() ? 2 : SkeletonMesh.VERTEX_SIZE;
            let slot = drawOrder[i];
            if (!slot.bone.active) {
                clipper.clipEndWithSlot(slot);
                continue;
            }
            let attachment = slot.getAttachment();
            let attachmentColor = null;
            let texture = null;
            let numFloats = 0;
            if (attachment instanceof RegionAttachment) {
                let region = attachment;
                attachmentColor = region.color;
                vertices = this.vertices;
                numFloats = vertexSize * 4;
                region.computeWorldVertices(slot.bone, vertices, 0, vertexSize);
                triangles = SkeletonMesh.QUAD_TRIANGLES;
                uvs = region.uvs;
                texture = region.region.renderObject.page.texture;
            }
            else if (attachment instanceof MeshAttachment) {
                let mesh = attachment;
                attachmentColor = mesh.color;
                vertices = this.vertices;
                numFloats = (mesh.worldVerticesLength >> 1) * vertexSize;
                if (numFloats > vertices.length) {
                    vertices = this.vertices = Utils.newFloatArray(numFloats);
                }
                mesh.computeWorldVertices(slot, 0, mesh.worldVerticesLength, vertices, 0, vertexSize);
                triangles = mesh.triangles;
                uvs = mesh.uvs;
                texture = mesh.region.renderObject.page.texture;
            }
            else if (attachment instanceof ClippingAttachment) {
                let clip = (attachment);
                clipper.clipStart(slot, clip);
                continue;
            }
            else {
                clipper.clipEndWithSlot(slot);
                continue;
            }
            if (texture != null) {
                let skeleton = slot.bone.skeleton;
                let skeletonColor = skeleton.color;
                let slotColor = slot.color;
                let alpha = skeletonColor.a * slotColor.a * attachmentColor.a;
                let color = this.tempColor;
                color.set(skeletonColor.r * slotColor.r * attachmentColor.r, skeletonColor.g * slotColor.g * attachmentColor.g, skeletonColor.b * slotColor.b * attachmentColor.b, alpha);
                let finalVertices;
                let finalVerticesLength;
                let finalIndices;
                let finalIndicesLength;
                if (clipper.isClipping()) {
                    clipper.clipTriangles(vertices, numFloats, triangles, triangles.length, uvs, color, null, false);
                    let clippedVertices = clipper.clippedVertices;
                    let clippedTriangles = clipper.clippedTriangles;
                    if (this.vertexEffect != null) {
                        let vertexEffect = this.vertexEffect;
                        let verts = clippedVertices;
                        for (let v = 0, n = clippedVertices.length; v < n; v += vertexSize) {
                            tempPos.x = verts[v];
                            tempPos.y = verts[v + 1];
                            tempLight.setFromColor(color);
                            tempDark.set(0, 0, 0, 0);
                            tempUv.x = verts[v + 6];
                            tempUv.y = verts[v + 7];
                            vertexEffect.transform(tempPos, tempUv, tempLight, tempDark);
                            verts[v] = tempPos.x;
                            verts[v + 1] = tempPos.y;
                            verts[v + 2] = tempLight.r;
                            verts[v + 3] = tempLight.g;
                            verts[v + 4] = tempLight.b;
                            verts[v + 5] = tempLight.a;
                            verts[v + 6] = tempUv.x;
                            verts[v + 7] = tempUv.y;
                        }
                    }
                    finalVertices = clippedVertices;
                    finalVerticesLength = clippedVertices.length;
                    finalIndices = clippedTriangles;
                    finalIndicesLength = clippedTriangles.length;
                }
                else {
                    let verts = vertices;
                    if (this.vertexEffect != null) {
                        let vertexEffect = this.vertexEffect;
                        for (let v = 0, u = 0, n = numFloats; v < n; v += vertexSize, u += 2) {
                            tempPos.x = verts[v];
                            tempPos.y = verts[v + 1];
                            tempLight.setFromColor(color);
                            tempDark.set(0, 0, 0, 0);
                            tempUv.x = uvs[u];
                            tempUv.y = uvs[u + 1];
                            vertexEffect.transform(tempPos, tempUv, tempLight, tempDark);
                            verts[v] = tempPos.x;
                            verts[v + 1] = tempPos.y;
                            verts[v + 2] = tempLight.r;
                            verts[v + 3] = tempLight.g;
                            verts[v + 4] = tempLight.b;
                            verts[v + 5] = tempLight.a;
                            verts[v + 6] = tempUv.x;
                            verts[v + 7] = tempUv.y;
                        }
                    }
                    else {
                        for (let v = 2, u = 0, n = numFloats; v < n; v += vertexSize, u += 2) {
                            verts[v] = color.r;
                            verts[v + 1] = color.g;
                            verts[v + 2] = color.b;
                            verts[v + 3] = color.a;
                            verts[v + 4] = uvs[u];
                            verts[v + 5] = uvs[u + 1];
                        }
                    }
                    finalVertices = vertices;
                    finalVerticesLength = numFloats;
                    finalIndices = triangles;
                    finalIndicesLength = triangles.length;
                }
                if (finalVerticesLength == 0 || finalIndicesLength == 0) {
                    clipper.clipEndWithSlot(slot);
                    continue;
                }
                // Start new batch if this one can't hold vertices/indices
                if (!batch.canBatch(finalVerticesLength, finalIndicesLength)) {
                    batch.end();
                    batch = this.nextBatch();
                    batch.begin();
                }
                const slotBlendMode = slot.data.blendMode;
                const slotTexture = texture.texture;
                const materialGroup = batch.findMaterialGroup(slotTexture, slotBlendMode);
                batch.addMaterialGroup(finalIndicesLength, materialGroup);
                batch.batch(finalVertices, finalVerticesLength, finalIndices, finalIndicesLength, z);
                z += zOffset;
            }
            clipper.clipEndWithSlot(slot);
        }
        clipper.clipEnd();
        batch.end();
    }
}
SkeletonMesh.QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0];
SkeletonMesh.VERTEX_SIZE = 2 + 2 + 4;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2tlbGV0b25NZXNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1NrZWxldG9uTWVzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OytFQTJCK0U7QUFFL0UsT0FBTyxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBYSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFtQixnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQW9DLEtBQUssRUFBRSxPQUFPLEVBQWdCLE1BQU0sOEJBQThCLENBQUM7QUFDdlEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUsvQixNQUFNLE9BQU8sb0JBQXFCLFNBQVEsS0FBSyxDQUFDLGNBQWM7SUFDN0QsWUFBYSxVQUFvRDtRQUNoRSxJQUFJLFlBQVksR0FBRzs7Ozs7Ozs7O0dBU2xCLENBQUM7UUFDRixJQUFJLGNBQWMsR0FBRzs7Ozs7Ozs7Ozs7OztHQWFwQixDQUFDO1FBRUYsSUFBSSxVQUFVLEdBQW1DO1lBQ2hELFFBQVEsRUFBRTtnQkFDVCxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO2FBQ3BCO1lBQ0QsWUFBWSxFQUFFLFlBQVk7WUFDMUIsY0FBYyxFQUFFLGNBQWM7WUFDOUIsSUFBSSxFQUFFLEtBQUssQ0FBQyxVQUFVO1lBQ3RCLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLFNBQVMsRUFBRSxHQUFHO1NBQ2QsQ0FBQztRQUNGLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN2QixJQUFJLFVBQVUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFO1lBQzdCLFVBQVUsQ0FBQyxPQUFPLEdBQUcsRUFBRSxxQkFBcUIsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUNsRCxVQUFVLENBQUMsUUFBUSxDQUFD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RyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDOzRCQUMzQixLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7NEJBQzNCLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQzs0QkFDM0IsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDOzRCQUMzQixLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQ3hCLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQzt5QkFDeEI7cUJBQ0Q7eUJBQU07d0JBQ04sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFOzRCQUNyRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs0QkFDbkIsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOzRCQUN2QixLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBQ3ZCLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs0QkFDdkIsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3RCLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt5QkFDMUI7cUJBQ0Q7b0JBQ0QsYUFBYSxHQUFHLFFBQVEsQ0FBQztvQkFDekIsbUJBQW1CLEdBQUcsU0FBUyxDQUFDO29CQUNoQyxZQUFZLEdBQUcsU0FBUyxDQUFDO29CQUN6QixrQkFBa0IsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO2lCQUN0QztnQkFFRCxJQUFJLG1CQUFtQixJQUFJLENBQUMsSUFBSSxrQkFBa0IsSUFBSSxDQUFDLEVBQUU7b0JBQ3hELE9BQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzlCLFNBQVM7aUJBQ1Q7Z0JBRUQsMERBQTBEO2dCQUMxRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxrQkFBa0IsQ0FBQyxFQUFFO29CQUM3RCxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ1osS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDekIsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUNkO2dCQUVELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUMxQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO2dCQUNwQyxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2dCQUUxRSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0JBQzFELEtBQUssQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLG1CQUFtQixFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDckYsQ0FBQyxJQUFJLE9BQU8sQ0FBQzthQUNiO1lBRUQsT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM5QjtRQUNELE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsQixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDYixDQUFDOztBQTdOTSwyQkFBYyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNwQyx3QkFBVyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDIn0=