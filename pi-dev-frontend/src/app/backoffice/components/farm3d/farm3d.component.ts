import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface FarmField {
  id: string;
  position: { x: number; z: number };
  dimensions: { width: number; length: number };
}

@Component({
  selector: 'app-farm3d',
  templateUrl: './farm3d.component.html',
  styleUrls: ['./farm3d.component.css']
})
export class Farm3DComponent implements OnInit {
  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef;
  @Input() farmData: { fields: FarmField[] } = { fields: [] };

  selectedField: FarmField | null = null;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private fieldObjects: THREE.Mesh[] = [];

  ngOnInit(): void {
    this.initThreeJS();
    this.createFarmModel();
    this.animate();
  }

  private initThreeJS(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeaf7ea);

    const { clientWidth, clientHeight } = this.canvasRef.nativeElement;
    const aspectRatio = clientWidth / clientHeight;

    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    this.camera.position.set(0, 50, 50);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      antialias: true
    });
    this.renderer.setSize(clientWidth, clientHeight);
    this.renderer.shadowMap.enabled = true;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.addLighting();
    this.handleResize();

    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private addLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
  }

  private handleResize(): void {
    const { clientWidth, clientHeight } = this.canvasRef.nativeElement;
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);
  }

  private createFarmModel(): void {
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    this.farmData.fields.forEach((field) => this.createField(field));
  }

  private createField(field: FarmField): void {
    const fieldGeometry = new THREE.PlaneGeometry(field.dimensions.width, field.dimensions.length);
    const fieldMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const fieldMesh = new THREE.Mesh(fieldGeometry, fieldMaterial);
    fieldMesh.rotation.x = -Math.PI / 2;
    fieldMesh.position.set(field.position.x, 0.1, field.position.z);
    fieldMesh.receiveShadow = true;
    fieldMesh.userData = { fieldId: field.id };
    this.scene.add(fieldMesh);
    this.fieldObjects.push(fieldMesh);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
