/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory  */

/**
 * Sample transaction processor function.
 * @param {org.example.basic.PackingProcessed} tx The sample transaction instance.
 * @transaction
 */
async function sampleTransactionP(tx) { 
       
    const order = tx.order;

    // Update the asset with the new value.
    order.status = 'SHIPPING';

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.example.basic.Order');
    // Update the asset in the asset registry.
    await assetRegistry.update(order);

    
}


/**
 * Sample transaction processor function.
 * @param {org.example.basic.ShippingProcessed} tx1 The sample transaction instance.
 * @transaction
 */
async function sampleTransactionS(tx) {  // eslint-disable-line no-unused-vars

    
       const order = tx1.order;

       
       order.status = "ARRIVED";
        if(tx1.timestamp>order.arrivalTime){
            order.onTime = false
        }else{
            order.onTime = true 
        }
       // Get the asset registry for the asset.
       const assetRegistry = await getAssetRegistry('org.example.basic.Order');
       // Update the asset in the asset registry.
       await assetRegistry.update(order);
   
    
}



/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.example.basic.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
async function setupDemo(setupDemo) { 

    const factory = getFactory();
    const NS = 'org.example.basic';
    
    const packingAdmin = factory.newResource(NS, 'PackingAdmin', '110');
    packingAdmin.email='packing@gmail.com' ;

    const shippingAdmin = factory.newResource(NS, 'ShippingAdmin', '111');
    shippingAdmin.email='shipping@gmail.com' ;

    
    const order = factory.newResource(NS, 'Order', '001');
    order.packingmanager = factory.newRelationship(NS, 'PackingAdmin', '110');
    order.shippingmanager = factory.newRelationship(NS, 'ShippingAdmin', '111');
    order.status='PACKING';
    const tomorrow = setupDemo.timestamp;
    tomorrow.setDate(tomorrow.getDate() + 1);
    order.arrivalTime = tomorrow; 
  
    const packingAdminRegistry = await getParticipantRegistry(NS + '.PackingAdmin');
    await packingAdminRegistry.addAll([packingAdmin]);

    const shippingAdminRegistry = await getParticipantRegistry(NS + '.ShippingAdmin');
    await shippingAdminRegistry.addAll([shippingAdmin]);

    const orderRegistry = await getAssetRegistry(NS + '.Order');
    await orderRegistry.addAll([order]);


}