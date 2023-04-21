import { Product } from './../entity/Product';
import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
// import { cloudinary } from 'cloudinary/lib';
import { v2 as cloudinary } from 'cloudinary';
import { api_key, api_secret, cloud_name } from '../config';



cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
});

export class ProductController {

    private productRepository = AppDataSource.getRepository(Product)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.productRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)


        const product = await this.productRepository.findOne({
            where: { id }
        })

        if (!product) {
            return "unregistered product"
        }
        return product
    }

    async save(request: Request, response: Response, next: NextFunction) {
        // console.log("enter save");
        // console.log(request.body);
        // console.log(request.file);
        // console.log(request.files);
        // console.log(request.files[0]["path"]);
        let res;
        let images: string[] = [];
        for (const file of request.files) {
            // console.log(file)
            res = await cloudinary.uploader.upload(file["path"], { public_id: file["filename"] });
            // console.log(res.secure_url);
            images.push(res.secure_url)
        }
        console.log(res)
        // console.log(images);
        // res.then((data) => {
        //     console.log(data);
        //     console.log(data.secure_url);
        //   }).catch((err) => {
        //     console.log(err);
        //   });
        // console.log(request);
        // return "error";
        const { Name, Price } = request.body;
        if (!Name || !Price) {
            throw Error("please enter the valid user data to create an item");
        }
        const product = Object.assign(new Product(), {
            Name,
            Price,
            Images: images
        })

        return this.productRepository.save(product)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let productToRemove = await this.productRepository.findOneBy({ id })
        // const url = productToRemove.Images[0]
        // console.log(fileName)
        for (const url of productToRemove.Images) {
            const fileNameWithExtension = url.substring(url.lastIndexOf('/') + 1);
            const fileName = fileNameWithExtension.split('.')[0];
            cloudinary.uploader.destroy(fileName, function (result) { console.log(result) });
        }
        
        // const fileName = url.substring(url.lastIndexOf('/') + 1);
        // cloudinary.uploader.destroy(fileName, function (result) { console.log(result) });

        // return fileName;

        if (!productToRemove) {
            return "this product not exist"
        }

        await this.productRepository.remove(productToRemove)

        return "product has been removed"
    }


    async update(request: Request, response: Response, next: NextFunction) {
        console.log(request.params);
        console.log(request.body);
        const id = parseInt(request.params.id);
        const productToUpdate = await this.productRepository.findOneBy({ id });
        
        if (!productToUpdate) {
            return "This product does not exist.";
        }
        
        // Update product name and price
        const { Name, Price } = request.body;
        if (!Name || !Price) {
            throw Error("Please enter valid product data to update.");
        }
        productToUpdate.Name = Name;
        productToUpdate.Price = Price;
    
        // Delete old images from Cloudinary
        for (const url of productToUpdate.Images) {
            const fileNameWithExtension = url.substring(url.lastIndexOf('/') + 1);
            const fileName = fileNameWithExtension.split('.')[0];
            await cloudinary.uploader.destroy(fileName);
        }
    
        // Upload new images to Cloudinary
        const newImages: string[] = [];
        for (const file of request.files) {
            const res = await cloudinary.uploader.upload(file["path"], { public_id: file["filename"] });
            newImages.push(res.secure_url);
        }
        productToUpdate.Images = newImages;
    
        await this.productRepository.save(productToUpdate);
        
    
        return "Product has been updated.";
    }
    

}