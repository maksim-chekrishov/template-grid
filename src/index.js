'use strict';

var TemplateGrid = require('./template-grid/template-grid');
var $ = require('jquery');

var GridColumn = require('./template-grid/template-grid-column');
var GridOptions = require('./template-grid/template-grid-options');

var DRIVE = ['передний', 'задний', 'полный'];
var FUEL = ['бензин', 'дизель'];

var dataService = {
    getFromGlobal: function() {
        return [
            {
                brandUrl: "Acura",
                completionTitle: "Techno",
                createdAt: null,
                drive: 1,
                finishedAt: null,
                fuel: "7.9",
                fuelType: 1,
                generationUrl: "I",
                id: 25004,
                isArchive: false,
                isAt: true,
                isCompletionOptions: false,
                isOptionsAvaliable: false,
                isPriceUndeclared: false,
                isPublished: true,
                modelSubGenerationId: 3,
                modelSubGenerationNewUrl: "i-sedan4d",
                modelSubUrl: "sedan4d",
                modelUrl: "TLX",
                newUrl: "24DCT-208",
                power: 208,
                price: 2199000,
                startedAt: Object,
                title: "2.4 DCT",
                updatedAt: Object,
                url: "24dct",
                usage: 20,
                volume: "2356.0",
                warranty: null
            },
            {
                brandUrl: "Acura",
                completionTitle: "Techno",
                createdAt: null,
                drive: 1,
                finishedAt: null,
                fuel: "7.9",
                fuelType: 1,
                generationUrl: "I",
                id: 25006,
                isArchive: false,
                isAt: true,
                isCompletionOptions: false,
                isOptionsAvaliable: false,
                isPriceUndeclared: false,
                isPublished: true,
                modelSubGenerationId: 3,
                modelSubGenerationNewUrl: "i-sedan4d",
                modelSubUrl: "sedan4d",
                modelUrl: "TLX",
                newUrl: "24DCT-208",
                power: 208,
                price: 21991111,
                startedAt: Object,
                title: "2.4 DCT amp",
                updatedAt: Object,
                url: "24dct",
                usage: 20,
                volume: "2356.0",
                warranty: null
            },
            {
                brandUrl: "Acura",
                completionTitle: "Techno",
                createdAt: null,
                drive: 1,
                finishedAt: null,
                fuel: "7.9",
                fuelType: 1,
                generationUrl: "I",
                id: 25005,
                isArchive: false,
                isAt: true,
                isCompletionOptions: false,
                isOptionsAvaliable: false,
                isPriceUndeclared: false,
                isPublished: true,
                modelSubGenerationId: 3,
                modelSubGenerationNewUrl: "i-sedan4d asz",
                modelSubUrl: "sedan4d",
                modelUrl: "TLX",
                newUrl: "24DCT-208",
                power: 178,
                price: 2000000,
                startedAt: Object,
                title: "Cucarara",
                updatedAt: Object,
                url: "24dct",
                usage: 20,
                volume: "2356.0",
                warranty: null
            },
        ]
    }
};

initGrid();

function initGrid() {
    var gridColumns = [
        new GridColumn({text: 'Название', dataField: 'title', width: 100}),
        new GridColumn({text: 'Комлектация', dataField: 'title'}),
        new GridColumn({text: 'Топливо', dataField: 'fuelType', formatter: fuelTypeFormatter}),
        new GridColumn({text: 'Привод', dataField: 'drive', formatter: driveFormatter}),
        new GridColumn({text: 'Расход топлива л/100км', dataField: 'fuel'}),
        new GridColumn({text: 'Цена, руб.', dataField: 'price'})
    ];

    var gridOptions = new GridOptions({
        source: dataService.getFromGlobal('catalogDetails.modifications'),
        columns: gridColumns,
        customBlockClass: 'modifications-grid'
    });

    var modificationsGrid = new TemplateGrid($('#grid'), gridOptions);

    modificationsGrid.render();
}

function fuelTypeFormatter(cellValue) {
    return cellValue
        ? FUEL[cellValue - 1]
        : gridOptions.noDataText;
}

function driveFormatter(cellValue) {
    return cellValue
        ? DRIVE[cellValue - 1]
        : gridOptions.noDataText;
}

